import { UuidProvider } from "src/declarations/providers/uuid";
import { v4 } from "uuid";

export class UuidProviderImpl implements UuidProvider {
  generate(): string {
    return v4();
  }
}
