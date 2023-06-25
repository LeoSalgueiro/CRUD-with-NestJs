import { Table, Column, Model, ForeignKey, DataType, BelongsTo, HasOne } from 'sequelize-typescript';
import { InicioSesion } from './InicioSesion.model';
import { Domicilio } from './Domicilio.model';

@Table
export class PerfilUsuario extends Model<PerfilUsuario> {
  @Column(DataType.STRING(50))
  nombre: string;

  @Column(DataType.STRING(50))
  apellido: string;

  @Column(DataType.STRING(20))
  dni: string;

  @Column(DataType.STRING(20))
  telefono: string;

  @Column(DataType.STRING(50))
  perfil: string;

  @Column(DataType.STRING(100))
  email: string;

  @ForeignKey(() => Domicilio)
  @Column(DataType.INTEGER)
  domicilio_id: number;

  @BelongsTo(() => Domicilio)
  domicilio: Domicilio;

  @HasOne(() => InicioSesion)
  inicioSesion: InicioSesion;
}
