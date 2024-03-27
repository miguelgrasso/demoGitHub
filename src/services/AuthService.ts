import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import UsuarioRepository from '../repositories/UsuarioRepository';
import PlanRepository from '../repositories/PlanRepository';
import Usuario from '../entities/Usuario';
import { ServiceError, AuthenticationException } from '../utils/errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Plan from '../entities/Plan';

@Service()
export default class AuthService {

    @InjectRepository()
    private usuarioRepository: UsuarioRepository;

    @InjectRepository()
    private menuRepository: PlanRepository;

    async login(username: string, password: string): Promise<Usuario> {
        try{
            const usuario = await this.usuarioRepository.findOne({ username, estado: 'A' });
            if(!usuario || !bcrypt.compareSync(password, usuario.password)) {
                throw new AuthenticationException('User y/o password invalid')
            }
//            const token = jwt.sign({ id: usuario.id, username: usuario.username, fullname: usuario.fullname, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
//            usuario.token = token;
            return usuario;
        } catch (e) {
            throw new ServiceError(e);
        }
    }

    async menus(nameRol: string): Promise<Plan> {
        try {
            const menus = await this.menuRepository.query("select m.id, m.name menu_name, m.title menu_title, m.url menu_url" +
                                                          "  from rol r" +
                                                          "      inner join privilegio p on r.id = p.rol_id" +
                                                          "      inner join menu m on m.id = p.menu_id" +
                                                          "  where r.name = '" + nameRol + "'");
            return menus;
        } catch (e) {
            throw new ServiceError(e);
        }
    }

}
