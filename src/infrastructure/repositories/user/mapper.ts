import { UserModel } from "src/domain/models/user";
import { UserEntity } from "./entity";

export class UserMapper {
  static toModel({
    id,
    name,
    email,
    avatarId,
    updatedAt,
    createdAt,
  }: UserEntity): UserModel {
    return {
      id,
      name,
      email,
      avatarId,
      updatedAt,
      createdAt,
    };
  }
}
