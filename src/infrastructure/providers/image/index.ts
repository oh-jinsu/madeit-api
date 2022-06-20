import { ImageProvider } from "src/domain/providers/image";
import * as sharp from "sharp";

export class ImageProviderImpl implements ImageProvider {
  resize(buffer: Buffer, size: number): Promise<Buffer> {
    return sharp(buffer).resize(size).toBuffer();
  }
}
