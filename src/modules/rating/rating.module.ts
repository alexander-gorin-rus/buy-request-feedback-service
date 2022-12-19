import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingController } from './rating.controller';
import Rating from './rating.entity';
import { RatingService } from './rating.service';
import { ClientsModule } from '@nestjs/microservices';
import configuration from '../../config/configuration';
import { CommonModule } from '../../common/common.module';
import { DealModule } from '../../common/services/dealService/deal.module';
import { DealGrpcService } from '../../common/services/dealService/deal.grpc-service';
const { clients } = configuration();

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating]),
    ClientsModule.register(clients),
    CommonModule,
    DealModule,
  ],
  controllers: [RatingController],
  providers: [RatingService, DealGrpcService],
  exports: [TypeOrmModule, CommonModule, DealModule],
})
export class RatingModule {}
