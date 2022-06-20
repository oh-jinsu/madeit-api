import { ImageProvider } from "src/domain/providers/image";

export class MockImageProvider implements ImageProvider {
  resize = jest.fn<Promise<Buffer>, [Buffer, number]>();
}
