import {Router, Request, Response} from 'express'
import { pool } from '../db/pool'
import { throwServerError } from '../helpers/helpers'
import { AddNewTaskBody, ITaskEntity, MoveTaskToUpdateBoard } from '../types'


export const tasksRouter = Router()

tasksRouter.post('/get_all_tasks', async (req: Request<{}, {}, {room: string}>, res: Response) => {

    try {

        const room = req.body.room

        const data = await pool.query(
            `SELECT * FROM tasks
            WHERE room_name = $1`,
            [room]
        )

        if(data.rows.length === 0){
            res.status(200).json({message: `задач в комнате ${room} нет`, data: []})
            return
        }

        res.status(200).json({message: 'получены задачи', data: data.rows})
        
    } catch (error) {
        throwServerError(res, error)
    }

})

tasksRouter.post('/add_task', async (req: Request<{}, {}, AddNewTaskBody>, res: Response) => {

    try {

        const {room_name, title, column_name, position} = req.body

        await pool.query(
            `INSERT INTO tasks(room_name, title, column_name, position)
            VALUES($1, $2, $3, $4)`,
            [room_name, title, column_name, position]
        )
        
        res.status(200).json({message: 'задача добавлена', data: {room_name, title, column_name, position} })

    } catch (error) {
        throwServerError(res, error)
    }

})

tasksRouter.post('/delete_task', async (req: Request<{}, {}, {taskName: string, room: string}>, res: Response) => {

    try {

        const { taskName, room } = req.body

        await pool.query(
            `DELETE FROM tasks
            WHERE title = $1 AND room_name = $2`,
            [taskName, room]
        )

        res.status(200).json({ message: 'Задача удалена' })
    } catch (error) {
        throwServerError(res, error)
    }

})

tasksRouter.put('/move_task', async (req: Request<{}, {}, MoveTaskToUpdateBoard>, res: Response) => {

    try {

        const columnsNameArr: ('plan'| 'process'| 'ready')[] = ['plan', 'process', 'ready']

        const { room_name, fromColumn, toColumn, fromIndex, toIndex } = req.body

        const { rows } = await pool.query<ITaskEntity>(
            `SELECT * FROM tasks
            WHERE room_name = $1`,
            [room_name]
        )

        const board: Record<'plan'| 'process'| 'ready', string[]> = {
            plan: [],
            process: [],
            ready: [],
        }

        for (const column of columnsNameArr) {
            board[column] = rows
                .filter((task) => task.column_name === column)
                .sort((a, b) => Number(a.position) - Number(b.position))
                .map((task) => task.title)
        }

        const [movedTask] = board[fromColumn].splice(fromIndex, 1)

        if (!movedTask) {
            res.status(400).json({ message: 'Задача не найдена на указанной позиции' })
            return
        }

        board[toColumn].splice(toIndex, 0, movedTask)

        for (const column of columnsNameArr) {
            for (let i = 0; i < board[column].length; i++) {
                await pool.query(
                    `UPDATE tasks
                    SET column_name = $1, position = $2
                    WHERE room_name = $3 AND title = $4`,
                    [column, i, room_name, board[column][i]]
                )
            }
        }

        res.status(200).json({message: 'Обновили доску, задачи переставлены'})
        
    } catch (error) {
        throwServerError(res, error)
    }

})