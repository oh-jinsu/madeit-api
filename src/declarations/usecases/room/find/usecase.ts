import { Injectable } from "@nestjs/common";
import { UseCase } from "src/declarations/common/usecase";
import { ListOf } from "src/declarations/common/types";
import { RoomResult } from "src/declarations/results/room";
import {
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { LessThan, Repository } from "typeorm";
import { RoomEntity } from "src/declarations/entities/room";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { InjectRepository } from "@nestjs/typeorm";

export type Params = {
  cursor?: string;
  limit?: number;
};

@Injectable()
export class FindRoomsUseCase implements UseCase<Params, ListOf<RoomResult>> {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
  ) {}

  async execute({
    cursor,
    limit,
  }: Params): Promise<UseCaseResult<ListOf<RoomResult>>> {
    const cursored = cursor
      ? await this.roomRepository.findOne({
          where: {
            id: cursor,
          },
        })
      : null;

    const query = await this.roomRepository.find({
      where: {
        createdAt: LessThan(cursored?.createdAt || new Date()),
      },
      order: {
        createdAt: "DESC",
      },
      take: limit ? limit + (cursored ? 0 : 1) : null,
    });

    if (cursored) {
      query.unshift(cursored);
    }

    const next = limit && query.length === limit + 1 ? query.pop() : null;

    const items = await Promise.all(
      query.map(async ({ id, title, createdAt }) => {
        const participantCount = await this.participantRepository.count({
          where: {
            roomId: id,
          },
        });

        return {
          id,
          title,
          participantCount,
          createdAt,
        };
      }),
    );

    return new UseCaseOk({
      next: next?.id,
      items,
    });
  }
}
