import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessioController{
    async store(req, res){
        const {email, password} = req.body;
        
        //verificando se o email existe
        const user = await User.findOne({where: {email: email}});
        if(!user){
            return res.status(400).json({ error: 'Usuário não existe.' })
        }

        //verificar se a senha não é igual
        if(!(await user.checkPassword(password))){
            return res.status(400).json({ error: 'Senha incorreta.' })
        }

        const {id, name} = user;

        return res.json({
            user:{
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessioController();