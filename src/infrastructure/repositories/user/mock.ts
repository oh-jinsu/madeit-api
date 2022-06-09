import { Option } from "src/domain/common/enum";
import { UserModel } from "src/domain/models/user";
import {
  SaveUserDto,
  UpdateUserDto,
  UserRepository,
} from "src/domain/repositories/user";

export class MockUserRepository implements UserRepository {
  find = jest.fn<Promise<UserModel[]>, []>();

  findOne = jest.fn<Promise<Option<UserModel>>, [string]>();

  save = jest.fn<Promise<UserModel>, [SaveUserDto]>();

  update = jest.fn<Promise<UserModel>, [string, UpdateUserDto]>();

  delete = jest.fn<Promise<void>, [string]>();
}
