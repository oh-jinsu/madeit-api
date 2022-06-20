export abstract class KakaoAuthProvider {
  abstract verify(idToken: string): Promise<boolean>;

  abstract extractClaim(idToken: string): Promise<Record<string, string>>;
}
