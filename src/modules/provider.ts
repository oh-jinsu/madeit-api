import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppleAuthProvider } from "src/domain/providers/apple_auth";
import { AuthProvider } from "src/domain/providers/auth";
import { GoogleAuthProvider } from "src/domain/providers/google_auth";
import { HashProvider } from "src/domain/providers/hash";
import { ImageProvider } from "src/domain/providers/image";
import { KakaoAuthProvider } from "src/domain/providers/kakao_auth";
import { UuidProvider } from "src/domain/providers/uuid";
import { AppleAuthProviderImpl } from "src/infrastructure/providers/apple_auth";
import { AuthProviderImpl } from "src/infrastructure/providers/auth";
import { GoogleAuthProviderImpl } from "src/infrastructure/providers/google_auth";
import { HashProviderImpl } from "src/infrastructure/providers/hash";
import { ImageProviderImpl } from "src/infrastructure/providers/image";
import { KakaoAuthProviderImpl } from "src/infrastructure/providers/kakao_auth";
import { UuidProviderImpl } from "src/infrastructure/providers/uuid";

@Global()
@Module({
  imports: [HttpModule, JwtModule.register({})],
  providers: [
    {
      provide: UuidProvider,
      useClass: UuidProviderImpl,
    },
    {
      provide: HashProvider,
      useClass: HashProviderImpl,
    },
    {
      provide: AuthProvider,
      useClass: AuthProviderImpl,
    },
    {
      provide: AppleAuthProvider,
      useClass: AppleAuthProviderImpl,
    },
    {
      provide: GoogleAuthProvider,
      useClass: GoogleAuthProviderImpl,
    },
    {
      provide: KakaoAuthProvider,
      useClass: KakaoAuthProviderImpl,
    },
    {
      provide: ImageProvider,
      useClass: ImageProviderImpl,
    },
  ],
  exports: [
    UuidProvider,
    HashProvider,
    AuthProvider,
    AppleAuthProvider,
    GoogleAuthProvider,
    KakaoAuthProvider,
    ImageProvider,
  ],
})
export class ProviderModule {}
