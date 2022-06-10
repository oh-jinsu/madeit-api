import { ParticipantModel } from "src/domain/models/participant";
import { ParticipantEntity } from "./entity";

export class ParticipantMapper {
  static toModel({
    id,
    userId,
    roomId,
    joinedAt,
  }: ParticipantEntity): ParticipantModel {
    return {
      id,
      userId,
      roomId,
      joinedAt,
    };
  }
}
