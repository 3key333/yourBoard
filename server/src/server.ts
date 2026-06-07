import express, { Express } from "express"
import cors from 'cors'

export const createServer = (): Express => {

    const app = express()
    app.use(express.json())
    app.use(cors())
    return app

}

export const startServer = (app: Express): void => {

    const port = Number(process.env.SERVER_PORT) || 3000
    const host = String(process.env.LOCAL_HOST)

    app.listen(port, host, () => {
        console.log(`✔️ Server is running on http://${host}:${port}`)
    })

}
