import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { GrpcRequestService } from '../grpc.request.service';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import configuration from '../../../config/configuration';
import { ConfigService } from '@nestjs/config';
import { IDeal, IDealServiceClient } from '../../types/deal.interface';
import { ErrorStatusGrpc, IPaginatedArray } from '../../types';

const {
  packageNames: { DEAL_PACKAGE },
} = configuration();

@Injectable()
export class DealGrpcService
  extends GrpcRequestService
  implements OnModuleInit
{
  private dealService: IDealServiceClient;

  constructor(
    @Inject(DEAL_PACKAGE.name) private dealClient: ClientGrpc,
    private readonly configService: ConfigService,
  ) {
    super(dealClient);
  }

  onModuleInit() {
    this.dealService = this.dealClient.getService<IDealServiceClient>(
      this.configService.get('packageNames').DEAL_PACKAGE.packageName,
    );
  }

  async getDeals(userId: string): Promise<IPaginatedArray<IDeal>> {
    try {
      return await this.getResponse<
        IPaginatedArray<IDeal>,
        IDealServiceClient,
        any
      >(this.dealService, 'getDeals', {
        userId,
      });
    } catch (e) {
      throw new RpcException(ErrorStatusGrpc.UNKNOWN_ERROR);
    }
  }
}
