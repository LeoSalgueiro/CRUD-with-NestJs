import { Table, Column, Model, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { PerfilUsuario } from './PerfilUsuario.model';

@Table({ tableName: 'InicioSesion', timestamps: false })
export class InicioSesion extends Model<InicioSesion> {
  @ForeignKey(() => PerfilUsuario)
  @Column(DataType.INTEGER)
  usuario_id: number;

  @Column(DataType.STRING(100))
  hash: string;

  @BelongsTo(() => PerfilUsuario)
  perfilUsuario: PerfilUsuario;
}
