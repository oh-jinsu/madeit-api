import { AuthProvider, IssueTokenOptions } from "src/domain/providers/auth";

export class MockAuthProvider implements AuthProvider {
  issueAccessToken = jest.fn<Promise<string>, [IssueTokenOptions]>();

  verifyAccessToken = jest.fn<Promise<boolean>, [string]>();

  issueRefreshToken = jest.fn<Promise<string>, [IssueTokenOptions]>();

  verifyRefreshToken = jest.fn<Promise<boolean>, [string]>();

  extractClaim = jest.fn<Promise<Record<string, any>>, [string]>();
}
