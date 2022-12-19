import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { CommonModule } from './common/common.module';
import { AmqpModule } from './amqp/amqp.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RatingModule } from './modules/rating/rating.module';

const { databaseDefaultConfig, applicationName, amqp } = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      ...databaseDefaultConfig,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(applicationName, {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [amqp.exchanges.events],
      uri: `amqp://${amqp.username}:${amqp.password}@${amqp.hostname}:${amqp.port}`,
      connectionInitOptions: { wait: false },
    }),
    AmqpModule,
    CommonModule,
    RatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
