import { UuidProvider } from "src/domain/providers/uuid";

export class MockUuidProvider implements UuidProvider {
  v4 = jest.fn<string, []>();
}
