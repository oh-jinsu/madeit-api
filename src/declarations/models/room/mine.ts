import { RoomModel } from ".";
import { ChatModel } from "../chat";
import { TotalPerformanceModel } from "../performance/total";

export type MyRoomModel = RoomModel & {
  readonly myPerformance: TotalPerformanceModel;
  readonly lastChat?: ChatModel;
};
