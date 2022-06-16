import { KakaoClaimModel } from "../models/kakao_claim";

export abstract class KakaoAuthProvider {
  abstract verify(idToken: string): Promise<boolean>;

  abstract extractClaim(idToken: string): Promise<KakaoClaimModel>;
}
