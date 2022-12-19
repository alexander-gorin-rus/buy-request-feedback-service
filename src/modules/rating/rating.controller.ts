import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  ICreateRatingRequest,
  IGetRatingRequest,
  IGetRatingsUserRequest,
  GetUserRatingResponse,
  IRating,
} from './interfaces/rating.interface';
import { RatingService } from './rating.service';
import { CommonIsSuccessResponse, GetDataResponse } from '../../common/types';

@Controller()
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @GrpcMethod('FeedbackService')
  async createRating(
    request: ICreateRatingRequest,
  ): Promise<CommonIsSuccessResponse> {
    return await this.ratingService.createRating(request);
  }

  @GrpcMethod('FeedbackService')
  async getEntityRatings(
    request: IGetRatingRequest,
  ): Promise<GetDataResponse<IRating>> {
    return await this.ratingService.getRatingsByEntityId(request);
  }

  @GrpcMethod('FeedbackService')
  async getUserRatings(
    request: IGetRatingsUserRequest,
  ): Promise<GetUserRatingResponse> {
    return await this.ratingService.getUserRating(request);
  }
}
