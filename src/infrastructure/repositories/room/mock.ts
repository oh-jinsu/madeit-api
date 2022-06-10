import { Option } from "src/domain/common/enum";
import { ListOf } from "src/domain/models/list_of";
import { RoomModel } from "src/domain/models/room";
import { RoomRepository } from "src/domain/repositories/room";

export class MockRoomRepository implements RoomRepository {
  findOne = jest.fn<Promise<Option<RoomModel>>, [string]>();

  find = jest.fn<Promise<ListOf<RoomModel, string>>, [string, number]>();

  create = jest.fn<Promise<RoomModel>, [string]>();

  delete = jest.fn<Promise<void>, [string]>();
}
