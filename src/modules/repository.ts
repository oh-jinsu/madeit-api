import { Global, Module } from "@nestjs/common";
import { FileRepository } from "src/domain/repositories/file";
import { FileRepositoryImpl } from "src/infrastructure/repositories/file";

@Global()
@Module({
  providers: [
    {
      provide: FileRepository,
      useClass: FileRepositoryImpl,
    },
  ],
  exports: [FileRepository],
})
export class RepositoryModule {}
