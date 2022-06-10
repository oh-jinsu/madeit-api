import { Option } from "../common/enum";
import { ListOf } from "../models/list_of";
import { RoomModel } from "../models/room";

export abstract class RoomRepository {
  abstract findOne(id: string): Promise<Option<RoomModel>>;

  abstract find(cursor?: string, limit?: number): Promise<ListOf<RoomModel>>;

  abstract create(title: string): Promise<RoomModel>;

  abstract delete(id: string): Promise<void>;
}
