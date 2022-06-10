import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { None, Option, Some } from "src/domain/common/enum";
import { ListOf } from "src/domain/common/types";
import { RoomModel } from "src/domain/models/room";
import { RoomRepository } from "src/domain/repositories/room";
import { LessThan, Repository } from "typeorm";
import { v4 } from "uuid";
import { RoomEntity } from "./entity";
import { RoomMapper } from "./mapper";

@Injectable()
export class RoomRepositoryImpl implements RoomRepository {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly adaptee: Repository<RoomEntity>,
  ) {}

  async findOne(id: string): Promise<Option<RoomModel>> {
    const entity = await this.adaptee.findOne({ where: { id } });

    if (!entity) {
      return new None();
    }

    return new Some(RoomMapper.toModel(entity));
  }

  async find(cursor?: string, limit?: number): Promise<ListOf<RoomModel>> {
    const cursored = cursor
      ? await this.adaptee.findOne({
          where: {
            id: cursor,
          },
        })
      : null;

    const query = await this.adaptee.find({
      where: {
        createdAt: LessThan(cursored?.createdAt || new Date()),
      },
      order: {
        createdAt: "DESC",
      },
      take: limit ? limit + (cursored ? 0 : 1) : null,
    });

    if (cursored) {
      query.unshift(cursored);
    }

    const next = limit && query.length === limit + 1 ? query.pop() : null;

    return { next: next?.id, items: query.map(RoomMapper.toModel) };
  }

  async create(title: string): Promise<RoomModel> {
    const id = v4();

    const fresh = this.adaptee.create({ id, title });

    const entity = await this.adaptee.save(fresh);

    return RoomMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await this.adaptee.delete(id);
  }
}
