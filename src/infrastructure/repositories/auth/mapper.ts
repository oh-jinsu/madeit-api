import { AuthModel } from "src/domain/models/auth";
import { AuthEntity } from "./entity";

export class AuthMapper {
  static toModel({
    id,
    key,
    from,
    accessToken,
    refreshToken,
    updatedAt,
    createdAt,
  }: AuthEntity): AuthModel {
    return {
      id,
      key,
      from,
      accessToken,
      refreshToken,
      updatedAt,
      createdAt,
    };
  }
}
