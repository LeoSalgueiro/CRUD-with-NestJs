import { Table, Column, Model, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { PerfilUser } from './PerfilUser.model';

@Table({ tableName: 'InitSession', timestamps: false })
export class InitSession extends Model<InitSession> {
  @ForeignKey(() => PerfilUser)
  @Column(DataType.INTEGER)
  user_id: number;

  @Column(DataType.STRING(100))
  hash: string;

  @BelongsTo(() => PerfilUser)
  perfilUser: PerfilUser;
}
