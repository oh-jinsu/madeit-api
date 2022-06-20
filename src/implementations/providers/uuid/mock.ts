import { UuidProvider } from "src/declarations/providers/uuid";

export class MockUuidProvider implements UuidProvider {
  v4 = jest.fn<string, []>();
}
