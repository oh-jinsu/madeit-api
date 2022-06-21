import { RoomModel } from ".";
import { TotalPerformanceModel } from "../performance/total";

export type MyRoomModel = RoomModel & {
  readonly myPerformance: TotalPerformanceModel;
};
