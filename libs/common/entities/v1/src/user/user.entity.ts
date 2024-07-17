import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity {
  @PrimaryColumn({ generated: 'increment', nullable: false })
  public id: number;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: false })
  public username: string;

  @Column({ length: 255, nullable: true })
  public firstname: string;

  @Column({ length: 255, nullable: true })
  public lastname: string;

  @Column({ default: 0, nullable: false })
  public admin: boolean;

  @Column({ default: 1, nullable: false })
  public active: boolean;

  @Column({ length: 255, nullable: false, unique: true })
  public steamid: string;

  @CreateDateColumn({ nullable: false })
  public createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  public updatedAt: Date;
}
