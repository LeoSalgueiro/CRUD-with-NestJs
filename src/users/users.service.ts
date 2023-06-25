import { Injectable } from '@nestjs/common';
import { InicioSesion } from './models/InicioSesion.model';
import { PerfilUsuario } from './models/PerfilUsuario.model';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  async findOneForLogin(email: string, pass: string): Promise<PerfilUsuario | undefined> {

    const usuario = await PerfilUsuario.findOne({
      where: { email },
      include: [{ model: InicioSesion, required: true }],
    });

    
    if (usuario) {
      const { inicioSesion } = usuario;
      let puedeLogearse = bcrypt.compareSync(pass, inicioSesion.hash); 
      if(puedeLogearse === true){
        return usuario
        
      }
      
    }
    return undefined
  }


}
