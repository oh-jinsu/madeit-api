import { UuidProvider } from "src/declarations/providers/uuid";
import uuid from "uuid";

export class UuidProviderImpl implements UuidProvider {
  v4(): string {
    return uuid.v4();
  }
}
