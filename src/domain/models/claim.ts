export type ClaimGrade = "guest" | "member";

export type ClaimModel = {
  readonly id: string;
  readonly grade: ClaimGrade;
};
