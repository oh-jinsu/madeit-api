import { RoomModel } from "src/domain/models/room";
import { RoomEntity } from "./entity";

export class RoomMapper {
  static toModel({ id, title, createdAt }: RoomEntity): RoomModel {
    return {
      id,
      title,
      createdAt,
    };
  }
}
