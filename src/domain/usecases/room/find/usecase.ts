import { Injectable } from "@nestjs/common";
import { UseCase } from "src/domain/common/usecase";
import { ListOf } from "src/domain/common/types";
import { RoomResult } from "src/domain/results/room";
import { UseCaseOk, UseCaseResult } from "src/domain/common/usecase_result";
import { ParticipantRepository } from "src/domain/repositories/participant";
import { RoomRepository } from "src/domain/repositories/room";

export type Params = {
  cursor?: string;
  limit?: number;
};

@Injectable()
export class FindRoomsUseCase implements UseCase<Params, ListOf<RoomResult>> {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly participantRepository: ParticipantRepository,
  ) {}

  async execute({
    cursor,
    limit,
  }: Params): Promise<UseCaseResult<ListOf<RoomResult>>> {
    const { next, items: rooms } = await this.roomRepository.find(
      cursor,
      limit,
    );

    const items = await Promise.all(
      rooms.map(async ({ id, title, createdAt }) => {
        const participantCount = await this.participantRepository.countByRoomId(
          id,
        );

        return {
          id,
          title,
          participantCount,
          createdAt,
        };
      }),
    );

    return new UseCaseOk({
      next,
      items,
    });
  }
}
