import { Injectable } from '@nestjs/common';
import { InicioSesion } from './models/InicioSesion.model';
import { PerfilUsuario } from './models/PerfilUsuario.model';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { Domicilio } from './models/Domicilio.model';


@Injectable()
export class UsersService {

  constructor(
    @InjectModel(InicioSesion)
    private inicioSesionModel: typeof InicioSesion,
    @InjectModel(Domicilio)
    private domicilioModel: typeof Domicilio,
    @InjectModel(PerfilUsuario)
    private perfilUsuarioModel: typeof PerfilUsuario,
  ) {}


  async findOneForLogin(email: string, pass: string): Promise<PerfilUsuario | undefined> {

    const usuario = await PerfilUsuario.findOne({
      where: { email },
      include: [{ model: InicioSesion, required: true }],
    });

    
    if (usuario !== null) {
      const { inicioSesion } = usuario;
      //let puedeLogearse = bcrypt.compareSync(pass, inicioSesion.hash); 
      let puedeLogearse = true;
      if(puedeLogearse === true){
        return usuario
        
      }
      
    }
    return undefined
  }




  async insertOne(saltos: number, usuario: string, contra: string) {
    console.log('Ingresando usuario');

    const hash = bcrypt.hashSync(contra, saltos);

    try {
      const existingUser = await this.perfilUsuarioModel.findOne({ where: { email: usuario } });
      if (existingUser) {
        console.log("El usuario ya existe");
        return null;
      }

      const domicilio = await this.domicilioModel.create({});
      const perfilUsuario = await this.perfilUsuarioModel.create({
        nombre: usuario,
        email: usuario,
        domicilio_id: domicilio.id,
      });
      await this.inicioSesionModel.create({
        usuario_id: perfilUsuario.id,
        hash,
      });

      console.log('Usuario ingresado correctamente');
      return perfilUsuario;
    } catch (error) {
      console.error('Error al insertar usuario:', error);
      return undefined;
    }
  }
}
