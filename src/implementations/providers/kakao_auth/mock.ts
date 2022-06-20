import { KakaoAuthProvider } from "src/declarations/providers/kakao_auth";

export class MockKakaoAuthProvider implements KakaoAuthProvider {
  verify = jest.fn<Promise<boolean>, [string]>();

  extractClaim = jest.fn<Promise<Record<string, any>>, [string]>();
}
