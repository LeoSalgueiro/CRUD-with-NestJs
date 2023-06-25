import { Table, Column, Model, HasOne, DataType } from 'sequelize-typescript';
import { PerfilUsuario } from './PerfilUsuario.model';

@Table
export class Domicilio extends Model<Domicilio> {
  @Column(DataType.STRING(100))
  calle: string;

  @Column(DataType.INTEGER)
  numero: number;

  @Column(DataType.STRING(50))
  ciudad: string;

  @Column(DataType.STRING(50))
  provincia: string;

  @Column(DataType.STRING(50))
  pais: string;

  @Column(DataType.STRING(10))
  codigo_postal: string;

  @HasOne(() => PerfilUsuario)
  perfilUsuario: PerfilUsuario;
}
