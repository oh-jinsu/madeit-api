import { Injectable } from "@nestjs/common";
import { RoomModel } from "src/declarations/models/room";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import { AuthProvider } from "src/declarations/providers/auth";
import { Repository } from "typeorm";
import { RoomEntity } from "src/declarations/entities/room";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { UuidProvider } from "src/declarations/providers/uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/declarations/entities/user";

export type Params = {
  readonly accessToken: string;
  readonly title: string;
  readonly description: string;
  readonly goalLabel: string;
  readonly goalType: "done" | "number" | "time" | "duration";
  readonly goalSymbol: string;
};

@Injectable()
export class CreateRoomUseCase extends AuthorizedUseCase<Params, RoomModel> {
  constructor(
    authProvider: AuthProvider,
    private readonly uuidProvider: UuidProvider,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    userId: string,
    { title, description, goalLabel, goalSymbol, goalType }: Params,
  ): Promise<UseCaseResult<RoomModel>> {
    const titleLength = ~-encodeURI(title).split(/%..|./).length;

    if (titleLength < 6) {
      return new UseCaseException(1);
    }

    if (titleLength > 96) {
      return new UseCaseException(2);
    }

    const newRoom = this.roomRepository.create({
      id: this.uuidProvider.generate(),
      ownerId: userId,
      title,
      description,
      goalLabel: goalLabel,
      goalType: goalType,
      goalSymbol: goalSymbol,
    });

    const room = await this.roomRepository.save(newRoom);

    const newParticipant = this.participantRepository.create({
      id: this.uuidProvider.generate(),
      userId,
      roomId: newRoom.id,
    });

    await this.participantRepository.save(newParticipant);

    const owner = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    return new UseCaseOk({
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
        label: goalLabel,
        value: -1,
        symbol: goalSymbol,
      },
      participantCount: 1,
      createdAt: room.createdAt,
    });
  }
}
