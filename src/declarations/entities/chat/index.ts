import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ChatEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column()
  type: "notice" | "message" | "image" | "photolog";

  @CreateDateColumn()
  createdAt: Date;
}
