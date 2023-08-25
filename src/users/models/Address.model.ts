import { Table, Column, Model, HasOne, DataType } from 'sequelize-typescript';
import { PerfilUser } from './PerfilUser.model';

@Table({
  tableName: 'Address',
  timestamps: false
})
export class Address extends Model<Address> {
  @Column(DataType.STRING(100))
  street: string;

  @Column(DataType.INTEGER)
  number: number;

  @Column(DataType.STRING(50))
  city: string;

  @Column(DataType.STRING(50))
  state: string;

  @Column(DataType.STRING(50))
  country: string;

  @Column(DataType.STRING(10))
  CP: string;

  @HasOne(() => PerfilUser)
  perfilUser: PerfilUser;
}
