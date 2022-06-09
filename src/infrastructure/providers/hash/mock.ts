import { HashProvider } from "src/domain/providers/hash";

export class MockHashProvider implements HashProvider {
  encode = jest.fn<Promise<string>, [string]>();

  compare = jest.fn<Promise<boolean>, [string, string]>();
}
