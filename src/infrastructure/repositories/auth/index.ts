import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { None, Option, Some } from "src/domain/common/enum";
import { AuthModel } from "src/domain/models/auth";
import {
  AuthRepository,
  SaveAuthDto,
  UpdateAuthDto,
} from "src/domain/repositories/auth";
import { Repository } from "typeorm";
import { v4 } from "uuid";
import { AuthEntity } from "./entity";
import { AuthMapper } from "./mapper";

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly adaptee: Repository<AuthEntity>,
  ) {}

  async findOne(id: string): Promise<Option<AuthModel>> {
    const entity = await this.adaptee.findOne({
      where: { id },
    });

    if (!entity) {
      return new None();
    }

    return new Some(AuthMapper.toModel(entity));
  }

  async findOneByKey(key: string): Promise<Option<AuthModel>> {
    const entity = await this.adaptee.findOne({
      where: { key },
    });

    if (!entity) {
      return new None();
    }

    return new Some(AuthMapper.toModel(entity));
  }

  async save(dto: SaveAuthDto): Promise<AuthModel> {
    const newone = this.adaptee.create({
      id: v4(),
      ...dto,
    });

    const entity = await this.adaptee.save(newone);

    return AuthMapper.toModel(entity);
  }

  async update(id: string, dto: UpdateAuthDto): Promise<AuthModel> {
    await this.adaptee.update(id, dto);

    const entity = await this.adaptee.findOne({
      where: { id },
    });

    return AuthMapper.toModel(entity);
  }

  async delete(id: string): Promise<void> {
    await this.adaptee.delete({
      id,
    });
  }
}
