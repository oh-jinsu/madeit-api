import { Injectable } from "@nestjs/common";
import { RoomResult } from "src/domain/results/room";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { ParticipantRepository } from "src/domain/repositories/participant";
import { RoomRepository } from "src/domain/repositories/room";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import { AuthProvider } from "src/domain/providers/auth";
import { ClaimModel } from "src/domain/models/claim";

export type Params = {
  readonly accessToken: string;
  readonly title: string;
};

@Injectable()
export class CreateRoomUseCase extends AuthorizedUseCase<Params, RoomResult> {
  constructor(
    authProvider: AuthProvider,
    private readonly roomRepository: RoomRepository,
    private readonly participantRepository: ParticipantRepository,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    { id: userId }: ClaimModel,
    { title }: Params,
  ): Promise<UseCaseResult<RoomResult>> {
    const titleLength = ~-encodeURI(title).split(/%..|./).length;

    if (titleLength < 6) {
      return new UseCaseException(1);
    }

    if (titleLength > 96) {
      return new UseCaseException(2);
    }

    const room = await this.roomRepository.create(title);

    await this.participantRepository.create(userId, room.id);

    return new UseCaseOk({
      id: room.id,
      title: room.title,
      participantCount: 1,
      createdAt: room.createdAt,
    });
  }
}
