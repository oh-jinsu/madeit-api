export type UserModel = {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly avatar?: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
};
