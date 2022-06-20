import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PerformanceEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column()
  value: number;

  @CreateDateColumn()
  createdAt: Date;
}
