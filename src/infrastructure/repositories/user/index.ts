import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { None, Option, Some } from "src/domain/common/enum";
import { UserModel } from "src/domain/models/user";
import { SaveUserDto, UserRepository } from "src/domain/repositories/user";
import { Repository } from "typeorm";
import { UserEntity } from "./entity";
import { UserMapper } from "./mapper";

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly adaptee: Repository<UserEntity>,
  ) {}

  async find(): Promise<UserModel[]> {
    const entities = await this.adaptee.find();

    return entities.map(UserMapper.toModel);
  }

  async findOne(id: string): Promise<Option<UserModel>> {
    const entity = await this.adaptee.findOne({ where: { id } });

    if (!entity) {
      return new None();
    }

    const result = UserMapper.toModel(entity);

    return new Some(result);
  }

  async save({ id, name, email, avatarId }: SaveUserDto): Promise<UserModel> {
    const newone = this.adaptee.create({
      id,
      name,
      email,
      avatarId,
    });

    const entity = await this.adaptee.save(newone);

    const result = UserMapper.toModel(entity);

    return result;
  }

  async update(
    id: string,
    dto: Partial<Omit<UserModel, "id" | "updatedAt" | "createdAt">>,
  ): Promise<UserModel> {
    await this.adaptee.update(id, dto);

    const entity = await this.adaptee.findOne({ where: { id } });

    const result = UserMapper.toModel(entity);

    return result;
  }

  async delete(id: string): Promise<void> {
    await this.adaptee.delete({ id });
  }
}
