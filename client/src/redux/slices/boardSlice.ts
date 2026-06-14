import { createSlice } from "@reduxjs/toolkit";

interface BoardState {
    board: {
        plan: string[];
        process: string[];
        ready: string[];
    }
}

const initialState: BoardState = {
    board: {
        plan: [],
        process: [],
        ready: [],
    }
}

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {

        addNewTask: (state, action) => {
            if(!state.board.plan.includes(action.payload)){
                state.board.plan.push(action.payload);
            }
        },

        deleteTask: (state, action) => {
            const payload: {columnName: string, taskName: string} = action.payload
            state.board[payload.columnName] = state.board[payload.columnName].filter((name) => name !== payload.taskName)
        },

        moveTask: (state, action) => {
            // payload приходит из onDragEnd
            const { fromColumn, toColumn, fromIndex, toIndex } = action.payload

            // 1. Вырезаем задачу из исходной колонки
            const [ task ] = state.board[fromColumn].splice(fromIndex, 1)

            // 2. Вставляем в целевую колонку на новую позицию
            state.board[toColumn].splice(toIndex, 0, task)
        }

    }
})

export default boardSlice.reducer
export const {
    addNewTask,
    deleteTask,
    moveTask
} = boardSlice.actions