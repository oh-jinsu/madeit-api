import { FileRepository } from "src/domain/repositories/file";

export class MockFileRepository implements FileRepository {
  upload = jest.fn<Promise<void>, [string, Buffer, string]>();

  remove = jest.fn<Promise<void>, [string]>();
}
