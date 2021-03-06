import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  AuthProvider,
  IssueTokenOptions,
} from "src/declarations/providers/auth";

@Injectable()
export class AuthProviderImpl implements AuthProvider {
  constructor(private readonly jwtService: JwtService) {}

  async issueAccessToken({ sub }: IssueTokenOptions): Promise<string> {
    return this.jwtService.sign(
      {},
      {
        subject: sub,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET_ACCESS_TOKEN,
        expiresIn: process.env.JWT_EXPIRES_IN_ACCESS_TOKEN,
      },
    );
  }

  async verifyAccessToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token, {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET_ACCESS_TOKEN,
      });

      return true;
    } catch {
      return false;
    }
  }

  async issueRefreshToken({ sub }: IssueTokenOptions): Promise<string> {
    return this.jwtService.sign(
      {},
      {
        subject: sub,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET_REFRESH_TOKEN,
        expiresIn: process.env.JWT_EXPIRES_IN_REFRESH_TOKEN,
      },
    );
  }

  async verifyRefreshToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token, {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET_REFRESH_TOKEN,
      });

      return true;
    } catch {
      return false;
    }
  }

  async extractClaim(token: string): Promise<Record<string, any>> {
    return this.jwtService.decode(token, {
      json: true,
    }) as Record<string, any>;
  }
}
