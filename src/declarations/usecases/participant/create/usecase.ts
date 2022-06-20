import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { AuthProvider } from "src/declarations/providers/auth";
import { UuidProvider } from "src/declarations/providers/uuid";
import { ParticipantResult } from "src/declarations/results/participant";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { RoomEntity } from "src/declarations/entities/room";
import { UserEntity } from "src/declarations/entities/user";
import { Repository } from "typeorm";
import { PerformanceEntity } from "src/declarations/entities/performance";

export type Params = {
  readonly accessToken: string;
  readonly roomId: string;
};

@Injectable()
export class CreateParticipantUseCase extends AuthorizedUseCase<
  Params,
  ParticipantResult
> {
  constructor(
    authProvider: AuthProvider,
    private readonly uuidProvider: UuidProvider,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(PerformanceEntity)
    private readonly performanceRepository: Repository<PerformanceEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    id: string,
    { roomId }: Params,
  ): Promise<UseCaseResult<ParticipantResult>> {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      return new UseCaseException(1);
    }

    const room = await this.roomRepository.findOne({ where: { id: roomId } });

    if (!room) {
      return new UseCaseException(2);
    }

    const owner = await this.userRepository.findOne({
      where: {
        id: room.ownerId,
      },
    });

    const option = await this.participantRepository.findOne({
      where: {
        userId: id,
        roomId,
      },
    });

    if (option) {
      return new UseCaseException(3);
    }

    const newone = this.participantRepository.create({
      id: this.uuidProvider.generate(),
      userId: id,
      roomId,
    });

    const participant = await this.participantRepository.save(newone);

    const participantCount = await this.participantRepository.count({
      where: {
        roomId,
      },
    });

    const performances = await this.performanceRepository.find({
      where: {
        roomId,
      },
    });

    const performanceValue =
      performances.length === 0
        ? -1
        : performances.reduce((prev, curr) => prev + curr.value, 0) /
          performances.length;

    return new UseCaseOk({
      id: participant.id,
      joinedAt: participant.joinedAt,
      user: {
        id: user.id,
        name: user.id,
        avatarId: user.avatarId,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      },
      room: {
        id: room.id,
        title: room.title,
        description: room.description,
        owner: {
          id: owner.id,
          name: owner.name,
          email: owner.email,
          avatarId: owner.avatarId,
          updatedAt: owner.updatedAt,
          createdAt: owner.createdAt,
        },
        performance: {
          label: room.goalLabel,
          value: performanceValue,
          symbol: room.goalSymbol,
        },
        participantCount,
        createdAt: room.createdAt,
      },
    });
  }
}
