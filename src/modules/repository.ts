import { Global, Module } from "@nestjs/common";
import { FileRepository } from "src/declarations/repositories/file";
import { FileRepositoryImpl } from "src/implementations/repositories/file";

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
