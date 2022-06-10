import { Global, Module } from "@nestjs/common";
import { RemoteFileStorage } from "src/infrastructure/sources/remote_file_storage";

@Global()
@Module({
  providers: [RemoteFileStorage],
  exports: [RemoteFileStorage],
})
export class SourceModule {}
