export type PhotologChatModel = {
  readonly type: "photolog";
  readonly message: string;
  readonly imageIds: string[];
  readonly isChecked: boolean;
};
