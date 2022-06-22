import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorizedUseCase } from "src/declarations/common/authorized_usecase";
import {
  UseCaseException,
  UseCaseOk,
  UseCaseResult,
} from "src/declarations/common/usecase_result";
import { AuthProvider } from "src/declarations/providers/auth";
import { ParticipantEntity } from "src/declarations/entities/participant";
import { Repository } from "typeorm";
import { UserEntity } from "src/declarations/entities/user";
import { UserModel } from "src/declarations/models/user";

export type Params = {
  readonly accessToken: string;
  readonly roomId: string;
};

export type Model = {
  readonly roomId: string;
  readonly user: UserModel;
};

@Injectable()
export class DeleteParticipantUseCase extends AuthorizedUseCase<Params, Model> {
  constructor(
    authProvider: AuthProvider,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(authProvider);
  }

  protected async executeWithAuth(
    userId: string,
    { roomId }: Params,
  ): Promise<UseCaseResult<Model>> {
    const participant = await this.participantRepository.findOne({
      where: {
        userId,
        roomId,
      },
    });

    if (!participant) {
      return new UseCaseException(1);
    }

    await this.participantRepository.delete(participant.id);

    const userEntity = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    const user = {
      id: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      avatarId: userEntity.avatarId,
      updatedAt: userEntity.updatedAt,
      createdAt: userEntity.createdAt,
    };

    return new UseCaseOk({
      roomId,
      user,
    });
  }
}
