import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const loadBoard = createAsyncThunk(
    'load/board',
    async (roomName: string, {rejectWithValue}) => {
        try {
            const data = await axios.post('http://localhost:3000/api/tasks/get_all_tasks', {room: roomName})

            return data.data.data ?? data.data ?? []

        } catch {
            return rejectWithValue('Ошибка запроса на загрузку доски')
        }
    }
)