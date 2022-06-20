import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class GoalEntity {
  @PrimaryColumn()
  roomId: string;

  @Column()
  label: string;

  @Column()
  type: "number" | "date" | "duration";

  @Column()
  symbol: string;

  @CreateDateColumn()
  createdAt: Date;
}
