import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppleAuthProvider } from "src/declarations/providers/apple_auth";
import { AuthProvider } from "src/declarations/providers/auth";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";
import { HashProvider } from "src/declarations/providers/hash";
import { ImageProvider } from "src/declarations/providers/image";
import { KakaoAuthProvider } from "src/declarations/providers/kakao_auth";
import { UuidProvider } from "src/declarations/providers/uuid";
import { AppleAuthProviderImpl } from "src/implementations/providers/apple_auth";
import { AuthProviderImpl } from "src/implementations/providers/auth";
import { GoogleAuthProviderImpl } from "src/implementations/providers/google_auth";
import { HashProviderImpl } from "src/implementations/providers/hash";
import { ImageProviderImpl } from "src/implementations/providers/image";
import { KakaoAuthProviderImpl } from "src/implementations/providers/kakao_auth";
import { UuidProviderImpl } from "src/implementations/providers/uuid";

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
