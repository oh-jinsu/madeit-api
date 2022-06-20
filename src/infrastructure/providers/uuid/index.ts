import { UuidProvider } from "src/domain/providers/uuid";
import uuid from "uuid";

export class UuidProviderImpl implements UuidProvider {
  v4(): string {
    return uuid.v4();
  }
}
