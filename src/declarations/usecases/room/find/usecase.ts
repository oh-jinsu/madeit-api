import { Injectable } from "@nestjs/common";
import { UseCase } from "src/declarations/common/usecase";
import { ListOf } from "src/declarations/common/types";
import { RoomModel } from "src/declarations/models/room";
import {
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { LessThan, Repository } from "typeorm";
import { RoomEntity } from "src/declarations/entities/room";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/declarations/entities/user";
import { PerformanceEntity } from "src/declarations/entities/performance";

export type Params = {
  cursor?: string;
  limit?: number;
};

@Injectable()
export class FindRoomsUseCase implements UseCase<Params, ListOf<RoomModel>> {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(PerformanceEntity)
    private readonly performanceRepository: Repository<PerformanceEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute({
    cursor,
    limit,
  }: Params): Promise<UseCaseResult<ListOf<RoomModel>>> {
    const cursored = cursor
      ? await this.roomRepository.findOne({
          where: {
            id: cursor,
          },
        })
      : null;

    const rooms = await this.roomRepository.find({
      where: {
        createdAt: LessThan(cursored?.createdAt || new Date()),
      },
      order: {
        createdAt: "DESC",
      },
      take: limit ? limit + (cursored ? 0 : 1) : null,
    });

    if (cursored) {
      rooms.unshift(cursored);
    }

    const next = limit && rooms.length === limit + 1 ? rooms.pop() : null;

    const items = await Promise.all(
      rooms.map(
        async ({
          id,
          title,
          description,
          ownerId,
          goalLabel,
          goalSymbol,
          maxParticipant,
          createdAt,
        }) => {
          const [participantCount, owner, performances] = await Promise.all([
            this.participantRepository.count({
              where: {
                roomId: id,
              },
            }),
            this.userRepository.findOne({
              where: {
                id: ownerId,
              },
            }),
            this.performanceRepository.find({
              where: {
                roomId: id,
              },
            }),
          ]);

          const performanceValue =
            performances.length === 0
              ? -1
              : performances.reduce((prev, curr) => prev + curr.value, 0) /
                performances.length;

          return {
            id,
            title,
            description,
            owner: {
              id: owner.id,
              name: owner.name,
              email: owner.email,
              avatarId: owner.avatarId,
              updatedAt: owner.updatedAt,
              createdAt: owner.createdAt,
            },
            performance: {
              label: goalLabel,
              value: performanceValue,
              symbol: goalSymbol,
            },
            participantCount,
            maxParticipant,
            createdAt,
          };
        },
      ),
    );

    return new UseCaseOk({
      next: next?.id,
      items,
    });
  }
}
