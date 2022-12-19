import { Observable } from 'rxjs';
import { IDefaultDBItem } from './index';

export interface IDealServiceClient {
  getDeals(userId: string): Observable<IDeal[]>;
}

export enum EDealStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
  CUSTOMER_PAID = 'CUSTOMER_PAID',
  DISPUTE = 'DISPUTE',
}

export interface IDeal extends IDefaultDBItem {
  requestId: string;
  offerId: string;
  sellerId: string;
  consumerId: string;
  status?: EDealStatus;
  additionalConditions: string;
  expiratedAt?: string;
}
