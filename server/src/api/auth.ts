import { Router, Request, Response } from "express";
import { IUserEntity, RegistrationNewUser } from "../types";
import { throwServerError } from "../helpers/helpers";
import dotenv from 'dotenv';
import { pool } from '../db/pool';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



dotenv.config()

export const authRouter = Router()

//               Request<Params, ResBody, ReqBody, Query>
authRouter.post('/', async (req: Request<{}, {}, RegistrationNewUser>, res: Response) => {

    try {

        const {name, password, passwordRepeat} = req.body

        const validate = name && name.trim() !== '' &&
        password && password.trim() !== '' && passwordRepeat && 
        passwordRepeat.trim() !== '' && 
        password === passwordRepeat

        if(!validate){
            res.status(400).json({message: 'Ваши данные аккаунта не валидны'})
            return 
        }

        const userId = await pool.query(
            `SELECT id FROM users 
            WHERE user_name = $1`,
            [name]
        )

        if(userId.rows.length > 0){
            res.status(409).json({message: 'Пользователь с таким именем уже существует'})
            return
        }
 
        //ХЕШ
        const saltRounds = 10 // "сложность хеша"
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const result = await pool.query(
            `INSERT INTO users (user_name, password_hash)
            VALUES ($1, $2)
            RETURNING id, user_name`, // возвращает данные в переменную 
            [name, hashedPassword]
        )

        //TOKEN

        const secretKey = String(process.env.JWT_SECRET)
        
        const token = jwt.sign(
            {userId: result.rows[0].id, userName: result.rows[0].user_name}, // данные 
            secretKey,                                                       // секрет
            {expiresIn: '24h'}                                               // настройки
        )

        
        res.status(200).json({
            message: 'Регистрация прошла успешно',
            token: token,
            user: {
                id: result.rows[0].id,
                name: result.rows[0].user_name
            }
        })
        
    } catch (error) {
        throwServerError(res, error)
    }
    
})

authRouter.post('/login', async (req: Request<{}, {}, {name: string, password: string}>, res: Response) => {
    
    try {

        const {name, password} = req.body

        const user = await pool.query<IUserEntity>(
            `SELECT * FROM users
            WHERE user_name = $1`,
            [name]
        )

        if(user.rows.length === 0){
            res.status(400).json({message: 'Пользователь не был зарегестрирован'})
            return
        }

        const isCurrentPassword = await bcrypt.compare(password, user.rows[0].password_hash) // сравнивает пароли

        if(!isCurrentPassword){
            res.status(200).json({message: 'Неправильный пароль или имя аккаунта'})
            return
        }

        const secretKey = String(process.env.JWT_SECRET)

        const token = jwt.sign(
            {userId: user.rows[0].id, userName: user.rows[0].user_name},
            secretKey,
            {expiresIn: '24h'}
        )

        res.status(200).json({message: 'Пользователь успешно вошел в аккаунт', token: token, data: user.rows[0]})

    } catch (error) {
        throwServerError(res, error)
    }

})