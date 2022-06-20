import { UserModel } from "../user";
import { ImageChatModel } from "./image";
import { MessageChatModel } from "./message";
import { PhotologChatModel } from "./photolog";

export type ChatModel = {
  readonly id: string;
  readonly roomId: string;
  readonly user: UserModel;
  readonly createdAt: Date;
} & (MessageChatModel | ImageChatModel | PhotologChatModel);
