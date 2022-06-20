import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { AuthProvider } from "src/domain/providers/auth";
import { UuidProvider } from "src/domain/providers/uuid";
import { ParticipantResult } from "src/domain/results/participant";
import { ParticipantEntity } from "src/domain/entities/participant";
import { RoomEntity } from "src/domain/entities/room";
import { UserEntity } from "src/domain/entities/user";
import { Repository } from "typeorm";

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
      id: this.uuidProvider.v4(),
      userId: id,
      roomId,
    });

    const participant = await this.participantRepository.save(newone);

    const participantCount = await this.participantRepository.count({
      where: {
        roomId,
      },
    });

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
        participantCount,
        createdAt: room.createdAt,
      },
    });
  }
}
