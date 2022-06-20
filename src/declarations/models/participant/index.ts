import { RoomModel } from "../room";
import { UserModel } from "../user";

export type ParticipantModel = {
  readonly id: string;
  readonly user: UserModel;
  readonly room: RoomModel;
  readonly joinedAt: Date;
};
