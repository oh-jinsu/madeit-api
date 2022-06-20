import { GoogleAuthProvider } from "src/declarations/providers/google_auth";

export class MockGoogleAuthProvider implements GoogleAuthProvider {
  verify = jest.fn<Promise<boolean>, [string]>();

  extractClaim = jest.fn<Promise<Record<string, any>>, [string]>();
}
