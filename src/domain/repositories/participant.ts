import { Option } from "../common/enum";
import { ParticipantModel } from "../models/participant";

export abstract class ParticipantRepository {
  abstract findOne(
    userId: string,
    roomId: string,
  ): Promise<Option<ParticipantModel>>;

  abstract findByUserId(userId: string): Promise<ParticipantModel[]>;

  abstract findByRoomId(roomId: string): Promise<ParticipantModel[]>;

  abstract countByRoomId(roomId: string): Promise<number>;

  abstract create(userId: string, roomId: string): Promise<ParticipantModel>;

  abstract delete(id: string): Promise<void>;
}
