import { AppleClaimModel } from "src/domain/models/apple_claim";
import { AppleAuthProvider } from "src/domain/providers/apple_auth";

export class MockAppleAuthProvider implements AppleAuthProvider {
  verify = jest.fn<Promise<boolean>, [string]>();

  extractClaim = jest.fn<Promise<AppleClaimModel>, [string]>();
}
