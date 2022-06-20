export type UserResult = {
  readonly id: string;
  readonly email?: string;
  readonly name: string;
  readonly avatarId?: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
};
