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


  //Find one user by email and compare his hash for log in
  async findOneForLogin(email: string, pass: string): Promise<PerfilUsuario | undefined> {

    const usuario = await PerfilUsuario.findOne({
      where: { email },
      include: [{ model: InicioSesion, required: true }],
    });

    
    if (usuario !== null) {
      const { inicioSesion } = usuario;
      let puedeLogearse = bcrypt.compareSync(pass, inicioSesion.hash); 
      //let puedeLogearse = true;
      if(puedeLogearse === true){
        return usuario
        
      }
      
    }
    return undefined
  }




  //Create a new user and return the info created
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


  //find a user by id of inicioSesion
  async findOne(id: number){
    try{
      const user = await this.inicioSesionModel.findOne({ 
        where: { usuario_id: id },
        include: [
          {
            model: PerfilUsuario, 
            required: true,
            include: [{
              model: Domicilio, 
              required: true
            }]
          }
        ]
      });

      const domicilio =  user['perfilUsuario']['domicilio'];
      return user;

    }
    catch(error){
      console.log(error)
    }
  }


  //delete all information of an user
  async deleteUserById(id: number){
    const transaction = await this.inicioSesionModel.sequelize.transaction();

    try {
      // Busca el usuario y sus relaciones
      const user = await this.inicioSesionModel.findOne({ 
        where: { usuario_id: id },
        include: [
          {
            model: PerfilUsuario, 
            required: true,
            include: [{
              model: Domicilio, 
              required: true
            }]
          }
        ],
        transaction,
      });

      if (user) {
        // Borra las relaciones y objetos relacionados
        await user.perfilUsuario.destroy({ transaction });
        await user.perfilUsuario.domicilio.destroy({ transaction });
        await user.destroy({ transaction });

        // Confirma la transacción
        await transaction.commit();
        return true;
      }

      // Si no se encuentra el usuario
      await transaction.rollback();
      return false;
    } catch (error) {
      // Si ocurre algún error, realiza un rollback de la transacción
      await transaction.rollback();
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  
  }


  //update user by id
  async updateUserById(id: number, body: any) {
    try {
      const usuario = await this.inicioSesionModel.findByPk(id, {
        include: [
          {
            model: PerfilUsuario, 
            required: true,
            include: [{
              model: Domicilio, 
              required: true
            }]
          }
        ],
      });
      const perfilUser = usuario['perfilUsuario']
      if (perfilUser) {
        // Actualizar los datos del usuario
        await perfilUser.update(body);

        // Si hay datos de domicilio en el body, actualizarlos
        if (body.perfilUsuario.domicilio) {
          const domicilio =  usuario['perfilUsuario']['domicilio'];
          if (domicilio) {
            await domicilio.update(body.perfilUsuario.domicilio);
          }
        }

        return usuario;
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return undefined;
    }
  }



}
