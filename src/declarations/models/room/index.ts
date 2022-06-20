import { TotalPerformanceModel } from "../performance/total";
import { UserModel } from "../user";

export type RoomModel = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly owner: UserModel;
  readonly performance: TotalPerformanceModel;
  readonly participantCount: number;
  readonly createdAt: Date;
};
