import { Table, Column, Model, ForeignKey, DataType, BelongsTo, HasOne } from 'sequelize-typescript';
import { InitSession } from './InitSession.model';
import { Address } from './Address.model';

@Table({ tableName: 'PerfilUser', timestamps: false })
export class PerfilUser extends Model<PerfilUser> {
  @Column(DataType.STRING(50))
  name: string;

  @Column(DataType.STRING(50))
  surname: string;

  @Column(DataType.STRING(20))
  identity_number: string;

  @Column(DataType.STRING(20))
  phone: string;

  @Column(DataType.STRING(50))
  perfil: string;

  @Column(DataType.STRING(100))
  email: string;

  @ForeignKey(() => Address)
  @Column(DataType.INTEGER)
  address_id: number;

  @BelongsTo(() => Address)
  Address: Address;

  @HasOne(() => InitSession)
  initSession: InitSession;
}
