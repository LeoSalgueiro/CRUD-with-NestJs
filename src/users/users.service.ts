import { Injectable } from '@nestjs/common';
import { InitSession } from './models/InitSession.model';
import { PerfilUser } from './models/PerfilUser.model';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './models/Address.model';


@Injectable()
export class UsersService {

  constructor(
    @InjectModel(InitSession)
    private initSessionModel: typeof InitSession,
    @InjectModel(Address)
    private addressModel: typeof Address,
    @InjectModel(PerfilUser)
    private perfilUserModel: typeof PerfilUser,
  ) {}


  //Find one user by email and compare his hash for log in
  async findOneForLogin(email: string, pass: string): Promise<PerfilUser | undefined> {

    const usuario = await this.perfilUserModel.findOne({
      where: { email },
      include: [{ model: InitSession, required: true }],
    });

    
    if (usuario !== null) {
      const { initSession } = usuario;
      let puedeLogearse = bcrypt.compareSync(pass, initSession.hash); 
      //let puedeLogearse = true;
      if(puedeLogearse === true){
        return usuario
        
      }
      
    }
    return undefined
  }




  //Create a new user and return the info created
  async insertOne(saltos: number, data: object) {
    console.log('Ingresando usuario...');
    console.log(data["perfil"].email )
    console.log(data["perfil"]["email"] )

    const hash = bcrypt.hashSync(data["perfil"]["password"], saltos);

    try {
      const existingUser = await this.perfilUserModel.findOne({ where: { email: data["perfil"]["email"] } });
      if (existingUser) {
        console.log("El usuario ya existe");
        return null;
      }

      const address = await this.addressModel.create(data["address"]);
      const perfilUsuario = await this.perfilUserModel.create({
        name: data["perfil"]["name"],
        surname: data["perfil"]["surname"],
        identity_number: data["perfil"]["identity_number"],
        phone: data["perfil"]["phone"],
        perfil: data["perfil"]["perfil"],
        email: data["perfil"]["email"],
        address_id: address.id,
      });
      await this.initSessionModel.create({
        user_id: perfilUsuario.id,
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
      const user = await this.initSessionModel.findOne({ 
        where: { user_id: id },
        include: [
          {
            model: PerfilUser, 
            required: true,
            include: [{
              model: Address, 
              required: true
            }]
          }
        ]
      });

      //const domicilio =  user['perfilUsuario']['domicilio'];
      if(user === null){
        
        return {error:"The user doesn't exists", data: null}
      }
      return {error:null, data:user["perfilUser"]}

    }
    catch(error){
      console.log(error)
    }
  }


  //delete all information of an user
  async deleteUserById(id: number){
    const transaction = await this.initSessionModel.sequelize.transaction();

    try {
      // Busca el usuario y sus relaciones
      const user = await this.initSessionModel.findOne({ 
        where: { user_id: id },
        include: [
          {
            model: PerfilUser, 
            required: true,
            include: [{
              model: Address, 
              required: true
            }]
          }
        ],
        transaction,
      });

      if (user) {
        // Borra las relaciones y objetos relacionados
        await user.destroy({ transaction });
        await user.perfilUser.destroy({ transaction });   
        await user.perfilUser.Address.destroy({ transaction });
        
        

        // Confirma la transacción
        await transaction.commit();
        return {error: false, msj: "The user has been deleted"};
      }

      // Si no se encuentra el usuario
      await transaction.rollback();
      return {error: true, msj: "The user has been deleted"};
    } catch (error) {
      // Si ocurre algún error, realiza un rollback de la transacción
      await transaction.rollback();
      console.error('Error: ', error);
      return {error: true, msj: "The user has not been deleted"};
    }
  
  }


  //update user by id
  async updateUserById(id: number, body: any) {
    try {
      const usuario = await this.initSessionModel.findByPk(id, {
        include: [
          {
            model: PerfilUser, 
            required: true,
            include: [{
              model: Address, 
              required: true
            }]
          }
        ],
      });
      const perfilUser = usuario['perfilUser']
      if (perfilUser) {
        // Actualizar los datos del usuario
        await perfilUser.update(body.perfil);

        // Si hay datos de domicilio en el body, actualizarlos
        if (body.perfil.address) {
          const domicilio =  usuario['perfilUser']['address'];
          if (domicilio) {
            await domicilio.update(body.perfil.address);
          }
        }

        return usuario["perfilUser"];
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return undefined;
    }
  }



}
