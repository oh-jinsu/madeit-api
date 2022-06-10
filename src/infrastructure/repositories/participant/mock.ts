import { Option } from "src/domain/common/enum";
import { ParticipantModel } from "src/domain/models/participant";
import { ParticipantRepository } from "src/domain/repositories/participant";

export class MockParticipantRepository implements ParticipantRepository {
  findOne = jest.fn<Promise<Option<ParticipantModel>>, [string, string]>();

  findByUserId = jest.fn<Promise<ParticipantModel[]>, [string]>();

  findByRoomId = jest.fn<Promise<ParticipantModel[]>, [string]>();

  countByRoomId = jest.fn<Promise<number>, [string]>();

  create = jest.fn<Promise<ParticipantModel>, [string, string]>();

  delete = jest.fn<Promise<void>, [string]>();
}
