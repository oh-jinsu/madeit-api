import { Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { GoogleAuthProvider } from "src/declarations/providers/google_auth";

@Injectable()
export class GoogleAuthProviderImpl implements GoogleAuthProvider {
  private client = new OAuth2Client();

  async verify(idToken: string): Promise<boolean> {
    try {
      await this.client.verifyIdToken({
        idToken,
        audience: [
          process.env.GOOGLE_OAUTH_CLIENT_ID_FOR_ANDROID,
          process.env.GOOGLE_OAUTH_CLIENT_ID_FOR_IOS,
        ],
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  async extractClaim(idToken: string): Promise<Record<string, any>> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_OAUTH_CLIENT_ID_FOR_ANDROID,
        process.env.GOOGLE_OAUTH_CLIENT_ID_FOR_IOS,
      ],
    });

    return ticket.getPayload();
  }
}
