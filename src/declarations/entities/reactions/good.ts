import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class GoodReactionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  photologId: string;

  @Column()
  sender: string;

  @CreateDateColumn()
  createdAt: Date;
}
