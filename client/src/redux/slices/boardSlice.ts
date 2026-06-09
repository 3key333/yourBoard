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
        }

    }
})

export default boardSlice.reducer
export const {
    addNewTask,
    deleteTask
} = boardSlice.actions