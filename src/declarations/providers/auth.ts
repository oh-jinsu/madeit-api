export type IssueTokenOptions = {
  sub: string;
};

export abstract class AuthProvider {
  abstract issueAccessToken(option: IssueTokenOptions): Promise<string>;

  abstract verifyAccessToken(token: string): Promise<boolean>;

  abstract issueRefreshToken(option: IssueTokenOptions): Promise<string>;

  abstract verifyRefreshToken(token: string): Promise<boolean>;

  abstract extractClaim(token: string): Promise<Record<string, any>>;
}
