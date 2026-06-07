import { Router, Request, Response } from 'express';
import { throwServerError } from '../helpers/helpers';
import { pool } from '../db/pool';


export const userRouter = Router()

userRouter.get('/', async (req: Request, res: Response) => {

    try {

        const users = await pool.query(
            `SELECT * FROM users`
        )

        if(users.rows.length === 0){
            res.status(400).json({message: 'Зарегестрированных пользователей пользователей сейчас нет '})
            return
        }

        res.status(200).json({data: users.rows})
        
    } catch (error) {
        throwServerError(res, error)
    }

})

userRouter.get('/:id', async (req: Request<{id: string}>, res: Response) => {

    try {

        const { id } = req.params

        const data = await pool.query(
            `SELECT * FROM users
            WHERE id = $1`,
            [id]
        )

        res.status(200).json({data: data.rows})
        
    } catch (error) {
        throwServerError(res, error)
    }

})