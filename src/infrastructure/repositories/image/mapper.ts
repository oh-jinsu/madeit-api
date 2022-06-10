import { ImageModel } from "src/domain/models/image";
import { ImageEntity } from "./entity";

export class ImageMapper {
  static toModel({ id, userId, createdAt }: ImageEntity): ImageModel {
    return {
      id,
      userId,
      createdAt,
    };
  }
}
