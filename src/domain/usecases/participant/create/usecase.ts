import { Injectable } from "@nestjs/common";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { ClaimModel } from "src/domain/models/claim";
import { AuthProvider } from "src/domain/providers/auth";
import { ParticipantRepository } from "src/domain/repositories/participant";
import { RoomRepository } from "src/domain/repositories/room";
import { UserRepository } from "src/domain/repositories/user";
import { ParticipantResult } from "src/domain/results/participant";

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
    private readonly userRepository: UserRepository,
    private readonly roomRepository: RoomRepository,
    private readonly participantRepository: ParticipantRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { roomId }: Params,
  ): Promise<UseCaseResult<ParticipantResult>> {
    const userOption = await this.userRepository.findOne(userId);

    if (!userOption.isSome()) {
      return new UseCaseException(1);
    }

    const user = userOption.value;

    const roomOption = await this.roomRepository.findOne(roomId);

    if (!roomOption.isSome()) {
      return new UseCaseException(2);
    }

    const room = roomOption.value;

    const participant = await this.participantRepository.create(
      user.id,
      room.id,
    );

    const participantCount = await this.participantRepository.countByRoomId(
      room.id,
    );

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
