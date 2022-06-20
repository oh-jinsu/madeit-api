import { ImageProvider } from "src/declarations/providers/image";

export class MockImageProvider implements ImageProvider {
  resize = jest.fn<Promise<Buffer>, [Buffer, number]>();
}
