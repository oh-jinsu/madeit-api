import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppleAuthProvider } from "src/domain/providers/apple_auth";
import { AuthProvider } from "src/domain/providers/auth";
import { GoogleAuthProvider } from "src/domain/providers/google_auth";
import { HashProvider } from "src/domain/providers/hash";
import { KakaoAuthProvider } from "src/domain/providers/kakao_auth";
import { AppleAuthProviderImpl } from "src/infrastructure/providers/apple_auth";
import { AuthProviderImpl } from "src/infrastructure/providers/auth";
import { GoogleAuthProviderImpl } from "src/infrastructure/providers/google_auth";
import { HashProviderImpl } from "src/infrastructure/providers/hash";
import { KakaoAuthProviderImpl } from "src/infrastructure/providers/kakao_auth";

@Global()
@Module({
  imports: [HttpModule, JwtModule.register({})],
  providers: [
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
      provide: HashProvider,
      useClass: HashProviderImpl,
    },
  ],
  exports: [
    AuthProvider,
    AppleAuthProvider,
    GoogleAuthProvider,
    KakaoAuthProvider,
    HashProvider,
  ],
})
export class ProviderModule {}
