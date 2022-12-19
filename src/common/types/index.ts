export interface IError {
  code: string;
  message: Array<string>;
}

export type CommonIsSuccessResponse = ICommonSuccess | ICommonFailure;

interface ICommonSuccess {
  isSuccess: true;
}

interface ICommonFailure {
  isSuccess: false;
  error: IError;
}

export interface IDefaultDBItem {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPaginatedArray<T> {
  data?: T[] | [];
  pageInfo: IPageInfo;
  error?: IError;
}

export interface IPageInfo {
  page: number;
  perPage: number;
  totalCount: number;
  totalPageCount: number;
}

export type GetDataResponse<D> = ISuccessData<D> | IFailureData;

interface ISuccessData<D> {
  data: D[];
}

interface IFailureData {
  data: [];
  error: IError;
}

export interface GrpcRequestInterface {
  getResponse<R, C, M>(client: C, grpcFunction: string, message: M): Promise<R>;
}

export enum ErrorStatusGrpc {
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  ACCESS_TOKEN_NOT_FOUND = 'ACCESS_TOKEN_NOT_FOUND',
}
