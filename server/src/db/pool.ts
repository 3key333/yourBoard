import { Pool }  from "pg"
import dotenv from 'dotenv'

export let pool: Pool

export const initDataBase = async (): Promise<Pool> => {
    try {

        pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            database: process.env.DB_NAME,
        })

        const client = pool.connect() // запрашиваем одно соединение из pool
        ;(await client).release()     // ждем пока client станет доступным и выпускаем его обратно

        console.log('✔️ bd connection success')

        
        return pool

    } catch (error) {
        console.log(error)
        throw error
    }
}

