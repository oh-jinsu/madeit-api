import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class RoomEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;
}
