import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CommonService } from '../../common/common.service';
import {
  GetRatings,
  GetRatingsWithOutPage,
  ICreateRatingRequest,
  IGetRatingRequest,
  IGetRatingsUserRequest,
  GetUserRatingResponse,
  INewRating,
  IRating,
  entityNames,
} from './interfaces/rating.interface';
import Rating from './rating.entity';
import {
  CommonIsSuccessResponse,
  ErrorStatusGrpc,
  GetDataResponse,
} from '../../common/types';
import { DealGrpcService } from '../../common/services/dealService/deal.grpc-service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RatingService extends CommonService {
  constructor(
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
    private dealGrpcService: DealGrpcService,
  ) {
    super(ratingRepository);
  }

  async createRating(
    request: ICreateRatingRequest,
  ): Promise<CommonIsSuccessResponse> {
    try {
      const { rating } = request;

      await this.save<INewRating, Rating>(rating);

      return {
        isSuccess: true,
      };
    } catch (error) {
      return {
        isSuccess: false,
        error,
      };
    }
  }

  async getRatingsByEntityId(
    request: IGetRatingRequest,
  ): Promise<GetDataResponse<IRating>> {
    const { entityId } = request;
    try {
      const where = [
        {
          entityId,
        },
      ];
      const ratings: IRating[] = await this.findByCriteria({
        where,
      });
      return {
        data: ratings,
      };
    } catch (error) {
      return {
        data: [],
        error,
      };
    }
  }

  async getUserRating(
    request: IGetRatingsUserRequest,
  ): Promise<GetUserRatingResponse> {
    const { userId, page, perPage } = request;
    try {
      const deals = await this.dealGrpcService.getDeals(userId);
      const dealsId = deals.data.map((deal) => deal.id);
      const fullRating = await this.getFullRatingByDealsId(dealsId, userId);

      const ratingSumValue = fullRating.data
        .map((ratings) => ratings.value)
        .reduce((prev, current) => prev + current);
      const userRating = Number(
        (ratingSumValue / fullRating.data.length).toFixed(1),
      );

      if (page && perPage) {
        const ratingsWithPage = await this.getUserRatingByDealsId(
          dealsId,
          userId,
          page,
          perPage,
        );
        return { userRating, ...ratingsWithPage };
      }

      return { userRating, ...fullRating };
    } catch (error) {
      if (page && perPage) {
        return {
          userRating: 0,
          pageInfo: {
            page,
            perPage,
            totalCount: 0,
            totalPageCount: 0,
          },
          error,
        };
      }
      return { userRating: 0, error };
    }
  }

  private async getUserRatingByDealsId(
    dealsId: string[],
    userId: string,
    page?: number,
    perPage?: number,
  ): Promise<GetRatings> {
    let ratings = [];
    let totalCount = 0;
    try {
      const skip = perPage ? perPage * (page - 1) : 1;
      await Promise.all(
        dealsId.map(async (dealId) => {
          const [currentRatings, currentTotalCount] =
            await this.findAndCountByCriteria<IRating>({
              where: {
                ...(dealId ? { entityId: dealId } : {}),
                entityName: entityNames.DEAL,
                authorId: Not(userId),
              },
              ...(page ? { skip } : {}),
              ...(perPage ? { take: perPage } : {}),
            });
          totalCount += currentTotalCount;
          ratings = ratings.concat(currentRatings);
        }),
      );
      return {
        data: ratings,
        pageInfo: {
          page,
          perPage,
          totalCount,
          totalPageCount: Math.ceil(totalCount / (perPage ? perPage : 1)),
        },
      };
    } catch (error) {
      throw new RpcException(ErrorStatusGrpc.DATABASE_ERROR);
    }
  }

  private async getFullRatingByDealsId(
    dealsId: string[],
    userId: string,
  ): Promise<GetRatingsWithOutPage> {
    let ratings = [];
    try {
      await Promise.all(
        dealsId.map(async (dealId) => {
          const currentRatings = await this.findByCriteria<IRating>({
            where: {
              ...(dealId ? { entityId: dealId } : {}),
              entityName: entityNames.DEAL,
              authorId: Not(userId),
            },
          });
          ratings = ratings.concat(currentRatings);
        }),
      );
      return {
        data: ratings,
      };
    } catch (error) {
      throw new RpcException(ErrorStatusGrpc.DATABASE_ERROR);
    }
  }
}
