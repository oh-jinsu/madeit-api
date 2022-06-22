import { NoticeChatModel } from "./notice";
import { UserChatModel } from "./user";

export type ChatModel = {
  readonly id: string;
  readonly roomId: string;
  readonly createdAt: Date;
} & (NoticeChatModel | UserChatModel);
