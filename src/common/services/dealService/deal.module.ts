import { Module } from '@nestjs/common';
import configuration from '../../../config/configuration';
import { ClientsModule } from '@nestjs/microservices';
import { DealGrpcService } from './deal.grpc-service';
import { ConfigService } from '@nestjs/config';
const { clients } = configuration();

@Module({
  imports: [ClientsModule.register(clients)],
  providers: [DealGrpcService, ConfigService],
  exports: [DealGrpcService],
})
export class DealModule {}
