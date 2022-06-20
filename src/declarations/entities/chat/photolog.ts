import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ChatPhotologEntity {
  @PrimaryColumn()
  chatId: string;

  @Column()
  isChecked: boolean;
}
