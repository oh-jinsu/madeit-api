export abstract class FileRepository {
  abstract upload(key: string, buffer: Buffer, mimetype: string): Promise<void>;

  abstract remove(key: string): Promise<void>;
}
