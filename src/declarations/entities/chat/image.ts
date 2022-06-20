import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ChatImageEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  chatId: string;

  @Column()
  imageId: string;
}
