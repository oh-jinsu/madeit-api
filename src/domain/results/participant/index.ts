import { RoomResult } from "../room";
import { UserResult } from "../user";

export type ParticipantResult = {
  readonly id: string;
  readonly user: UserResult;
  readonly room: RoomResult;
  readonly joinedAt: Date;
};
