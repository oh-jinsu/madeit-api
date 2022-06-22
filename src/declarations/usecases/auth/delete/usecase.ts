import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { AuthProvider } from "src/declarations/providers/auth";
import { NothingModel } from "src/declarations/models/common/nothing";
import { AuthEntity } from "src/declarations/entities/auth";
import { UserEntity } from "src/declarations/entities/user";
import { Repository } from "typeorm";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { RoomEntity } from "src/declarations/entities/room";

export type Params = {
  readonly accessToken: string;
};

@Injectable()
export class DeleteAuthUseCase extends AuthorizedUseCase<Params, NothingModel> {
  constructor(
    authProvider: AuthProvider,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    id: string,
  ): Promise<UseCaseResult<NothingModel>> {
    const rooms = await this.roomRepository.find({
      where: {
        ownerId: id,
      },
    });

    if (rooms.length !== 0) {
      return new UseCaseException(1);
    }

    await this.authRepository.delete(id);

    await this.userRepository.delete(id);

    await this.participantRepository.delete({
      userId: id,
    });

    return new UseCaseOk(null);
  }
}
