import { Option } from "src/domain/common/enum";
import { UserModel } from "src/domain/models/user";

export type SaveUserDto = {
  id: string;
  name: string;
  email?: string;
  avatarId?: string;
};

export type UpdateUserDto = Partial<
  Omit<UserModel, "id" | "from" | "updatedAt" | "createdAt">
>;

export abstract class UserRepository {
  abstract find(): Promise<UserModel[]>;

  abstract findOne(id: string): Promise<Option<UserModel>>;

  abstract save(dto: SaveUserDto): Promise<UserModel>;

  abstract update(id: string, dto: UpdateUserDto): Promise<UserModel>;

  abstract delete(id: string): Promise<void>;
}
