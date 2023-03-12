import { BehaviorSubject } from 'rxjs';

export enum KycStatus {
  LOADING,
  PASSED,
  REJECTED,
  RETRY,
  IN_PROGRESS,
  EMPTY,
}

export const setKycStatus = (status: KycStatus): void =>
  kycStatus$.next(status);

export const kycStatus$ = new BehaviorSubject<KycStatus>(KycStatus.LOADING);
