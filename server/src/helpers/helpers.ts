import { Response } from 'express'


export const throwServerError = (res: Response, error: unknown) => {
    res.status(500).json({message: 'Попробуйте позже'})
}