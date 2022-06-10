export type UserModel = {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly avatarId?: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
};
