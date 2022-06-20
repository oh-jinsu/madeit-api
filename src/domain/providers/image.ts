export abstract class ImageProvider {
  abstract resize(buffer: Buffer, size: number): Promise<Buffer>;
}
