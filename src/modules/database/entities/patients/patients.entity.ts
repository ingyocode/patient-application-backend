import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index(['name', 'phoneNumber'])
@Entity('patients')
export class PatientsEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 16, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phoneNumber!: string;

  @Column({ type: 'int', nullable: true })
  chartNumber?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 14, nullable: false })
  residentNumber: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  memo?: string;
}