import express, { Express } from "express"
import { createServer, Server as HttpServer } from "http"
import cors from 'cors'
import { Server as SocketServer } from 'socket.io'
import { MoveTaskSocketData } from "./types"

export const createAppServer = (): {app: Express, httpServer: HttpServer, io: SocketServer} => {

    const app = express()

    app.use(express.json())
    app.use(cors())

    const httpServer = createServer(app)

    const io = new SocketServer(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    io.on('connection', (socket) => {
        console.log('пользователь подключился')

        socket.on('join_room', (data: {userName: string, roomName: string}) => {
            socket.join(data.roomName)
            console.log(`к комнате ${data.roomName} подключился пользователь ${data.userName}`)
        })

        socket.on('add_task', (data: {roomName: string, taskName: string}) => {
            io.to(data.roomName).emit('add_task', data)
        })

        socket.on('delete_task', (data: {roomName: string, columnName: string, taskName: string}) => {
            io.to(data.roomName).emit('delete_task', {columnName: data.columnName, taskName: data.taskName})
        })

        socket.on('move_task', (data: MoveTaskSocketData) => {
            const payload = { 
                fromColumn: data.fromColumn, 
                toColumn: data.toColumn, 
                fromIndex: data.fromIndex, 
                toIndex: data.toIndex
            }
            io.to(data.roomName).emit('move_task', payload)
        })

        socket.on('disconnect', () => {
            console.log('пользователь отключлся')
        })

    })

    return { app, httpServer, io }

}

export const startServer = (httpServer: HttpServer): void => {

    const port = Number(process.env.SERVER_PORT) || 3000
    const host = String(process.env.LOCAL_HOST)  || 'localhost'

    httpServer.listen(port, host, () => {
        console.log(`✔️ Server is running on http://${host}:${port}`)
    })

}
