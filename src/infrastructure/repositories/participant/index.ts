import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { None, Option, Some } from "src/domain/common/enum";
import { ParticipantModel } from "src/domain/models/participant";
import { ParticipantRepository } from "src/domain/repositories/participant";
import { Repository } from "typeorm";
import { v4 } from "uuid";
import { ParticipantEntity } from "./entity";
import { ParticipantMapper } from "./mapper";

@Injectable()
export class ParticipantRepositoryImpl implements ParticipantRepository {
  constructor(
    @InjectRepository(ParticipantEntity)
    private readonly adaptee: Repository<ParticipantEntity>,
  ) {}

  async findOne(
    userId: string,
    roomId: string,
  ): Promise<Option<ParticipantModel>> {
    const entity = await this.adaptee.findOne({
      where: {
        userId,
        roomId,
      },
    });

    if (!entity) {
      return new None();
    }

    return new Some(ParticipantMapper.toModel(entity));
  }

  async findByUserId(userId: string): Promise<ParticipantModel[]> {
    const entities = await this.adaptee.find({ where: { userId } });

    return entities.map(ParticipantMapper.toModel);
  }

  async findByRoomId(roomId: string): Promise<ParticipantModel[]> {
    const entities = await this.adaptee.find({ where: { roomId } });

    return entities.map(ParticipantMapper.toModel);
  }

  async countByRoomId(roomId: string): Promise<number> {
    const result = await this.adaptee.count({ where: { roomId } });

    return result;
  }

  async create(userId: string, roomId: string): Promise<ParticipantModel> {
    const id = v4();

    const fresh = this.adaptee.create({ id, userId, roomId });

    const entity = await this.adaptee.save(fresh);

    return ParticipantMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await this.adaptee.delete(id);
  }
}
