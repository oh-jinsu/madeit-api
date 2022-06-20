import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ChatMessageEntity {
  @PrimaryColumn()
  chatId: string;

  @Column()
  message: string;
}
