import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['name', 'phone_number', 'chart_number'])
@Entity('patients')
export class PatientsEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 16, nullable: false })
  name!: string;

  @Column({ type: 'int', nullable: false })
  phoneNumber!: number;

  @Column({ type: 'int', nullable: true })
  chartNumber?: number;

  @Column({ type: 'int', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  residentNumber?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  memo?: string;
}