import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AppleAuthProvider } from "src/domain/providers/apple_auth";
import * as NodeRSA from "node-rsa";

@Injectable()
export class KakaoAuthProviderImpl implements AppleAuthProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}
  async verify(idToken: string): Promise<boolean> {
    const { keys } = await new Promise<any>((resolve, reject) =>
      this.httpService
        .get("https://kauth.kakao.com/.well-known/jwks.json")
        .subscribe({
          next: (value) => resolve(value.data),
          error: (error) => reject(error),
        }),
    );

    const { header } = this.jwtService.decode(idToken, {
      complete: true,
      json: true,
    }) as Record<string, any>;

    const key = keys.find(({ kid }) => kid === header.kid);

    if (!key) {
      return false;
    }

    const rsa = new NodeRSA();

    rsa.importKey({
      n: Buffer.from(key.n, "base64"),
      e: Buffer.from(key.e, "base64"),
    });

    const publicKey = rsa.exportKey("public");

    const algorithms = [header.alg];

    const issuer = "https://kauth.kakao.com";

    const audience = process.env.KAKAO_AUDIENCE;

    try {
      this.jwtService.verify(idToken, {
        publicKey,
        algorithms,
        issuer,
        audience,
      });

      return true;
    } catch {
      return false;
    }
  }

  async extractClaim(idToken: string): Promise<Record<string, any>> {
    return this.jwtService.decode(idToken, {
      json: true,
    }) as Record<string, any>;
  }
}
