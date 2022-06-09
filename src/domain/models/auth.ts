export type AuthModel = {
  readonly id: string;
  readonly key: string;
  readonly from: string;
  readonly accessToken?: string;
  readonly refreshToken?: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
};
