import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ComeOnReactionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  roomId: string;

  @Column()
  sender: string;

  @Column()
  receiver: string;

  @CreateDateColumn()
  createdAt: Date;
}
