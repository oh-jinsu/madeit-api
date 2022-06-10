import { Option } from "src/domain/common/enum";
import { ImageModel } from "src/domain/models/image";
import { ImageRepository, SaveImageDto } from "src/domain/repositories/image";

export class MockImageRepository implements ImageRepository {
  findOne = jest.fn<Promise<Option<ImageModel>>, [string]>();

  save = jest.fn<Promise<ImageModel>, [SaveImageDto]>();

  delete = jest.fn<Promise<void>, [string]>();
}
