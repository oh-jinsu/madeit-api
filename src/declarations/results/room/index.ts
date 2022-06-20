import { TotalPerformanceResult } from "../performance/total";
import { UserResult } from "../user";

export type RoomResult = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly owner: UserResult;
  readonly performance: TotalPerformanceResult;
  readonly participantCount: number;
  readonly createdAt: Date;
};
