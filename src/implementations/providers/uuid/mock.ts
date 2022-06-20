import { UuidProvider } from "src/declarations/providers/uuid";

export class MockUuidProvider implements UuidProvider {
  generate = jest.fn<string, []>();
}
