import { Injectable } from "@nestjs/common";
import { RoomResult } from "src/domain/results/room";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/domain/common/usecase_result";
import { AuthorizedUseCase } from "src/domain/common/authorized_usecase";
import { AuthProvider } from "src/domain/providers/auth";
import { Repository } from "typeorm";
import { RoomEntity } from "src/domain/entities/room";
import { ParticipantEntity } from "src/domain/entities/participant";
import { UuidProvider } from "src/domain/providers/uuid";
import { InjectRepository } from "@nestjs/typeorm";

export type Params = {
  readonly accessToken: string;
  readonly title: string;
};

@Injectable()
export class CreateRoomUseCase extends AuthorizedUseCase<Params, RoomResult> {
  constructor(
    authProvider: AuthProvider,
    private readonly uuidProvider: UuidProvider,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    userId: string,
    { title }: Params,
  ): Promise<UseCaseResult<RoomResult>> {
    const titleLength = ~-encodeURI(title).split(/%..|./).length;

    if (titleLength < 6) {
      return new UseCaseException(1);
    }

    if (titleLength > 96) {
      return new UseCaseException(2);
    }

    const newRoom = this.roomRepository.create({
      id: this.uuidProvider.v4(),
      title,
    });

    const room = await this.roomRepository.save(newRoom);

    const newParticipant = this.participantRepository.create({
      id: this.uuidProvider.v4(),
      userId,
      roomId: newRoom.id,
    });

    await this.participantRepository.save(newParticipant);

    return new UseCaseOk({
      id: room.id,
      title: room.title,
      participantCount: 1,
      createdAt: room.createdAt,
    });
  }
}
