import { UserModel } from "../user";
import { ImageChatModel } from "./image";
import { MessageChatModel } from "./message";
import { PhotologChatModel } from "./photolog";

export type UserChatModel = {
  readonly user: UserModel;
} & (MessageChatModel | ImageChatModel | PhotologChatModel);
