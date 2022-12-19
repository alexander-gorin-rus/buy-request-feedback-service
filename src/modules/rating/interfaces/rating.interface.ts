import { IError, IPageInfo } from '../../../common/types';

export enum entityNames {
  DEAL = 'DEAL',
  PRODUCT = 'PRODUCT',
}

export interface INewRating {
  entityId: string;
  entityName: string;
  authorId: string;
  value: number;
  comment?: string;
}

export interface IRating {
  id: string;
  entityId: string;
  entityName: string;
  authorId: string;
  value: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateRatingRequest {
  rating: INewRating;
}

export type GetRatings = RatingSuccessWithPage | RatingFailWithPage;

export interface RatingSuccessWithPage {
  data: IRating[];
  pageInfo: IPageInfo;
}

export interface RatingFailWithPage {
  data: [];
  pageInfo: IPageInfo;
}

export type GetRatingsWithOutPage =
  | Omit<RatingSuccessWithPage, 'pageInfo'>
  | Omit<RatingFailWithPage, 'pageInfo'>;

export interface IGetRatingRequest {
  entityId: string;
}

export interface IGetRatingsUserRequest {
  userId: string;
  page?: number;
  perPage?: number;
}

export type GetUserRatingResponse =
  | {
      userRating: number;
      data: IRating[];
      pageInfo: IPageInfo;
      error?: IError;
    }
  | {
      userRating: number;
      error?: IError;
    };
