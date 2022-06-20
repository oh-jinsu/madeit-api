import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import {
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { AuthProvider } from "src/declarations/providers/auth";
import { RoomResult } from "src/declarations/results/room";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { RoomEntity } from "src/declarations/entities/room";
import { Repository } from "typeorm";
import { PerformanceEntity } from "src/declarations/entities/performance";
import { UserEntity } from "src/declarations/entities/user";

export type Params = {
  readonly accessToken: string;
};

@Injectable()
export class FindMyRoomsUsecase extends AuthorizedUseCase<
  Params,
  RoomResult[]
> {
  constructor(
    authProvider: AuthProvider,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(PerformanceEntity)
    private readonly performanceRepository: Repository<PerformanceEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    userId: string,
  ): Promise<UseCaseResult<RoomResult[]>> {
    const participants = await this.participantRepository.find({
      where: {
        userId,
      },
    });

    const rooms = await Promise.all(
      participants.map(async ({ roomId }) => {
        const {
          id,
          title,
          description,
          ownerId,
          goalLabel,
          goalSymbol,
          createdAt,
        } = await this.roomRepository.findOne({
          where: {
            id: roomId,
          },
        });

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
          createdAt,
        };
      }),
    );

    return new UseCaseOk(rooms);
  }
}
