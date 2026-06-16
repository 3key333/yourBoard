import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadBoard } from "../thunk/boardThunk";

type ColumnName = 'plan' | 'process' | 'ready';

interface ITaskEntity {
    room_name: string; 
    title: string; 
    column_name: string; 
    position: number;
}

interface BoardState {
    board: Record<ColumnName, string[]>
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

        deleteTask: (state, action: PayloadAction<{ columnName: ColumnName; taskName: string }>) => {
            const { columnName, taskName } = action.payload
            state.board[columnName] = state.board[columnName].filter((name) => name !== taskName)
        },

        moveTask: (state, action: PayloadAction<{
            fromColumn: ColumnName;
            toColumn: ColumnName;
            fromIndex: number;
            toIndex: number;
        }>) => {
            const { fromColumn, toColumn, fromIndex, toIndex } = action.payload

            const [ task ] = state.board[fromColumn].splice(fromIndex, 1)

            state.board[toColumn].splice(toIndex, 0, task)
        }

    },

    extraReducers: (builder) => {
        builder 

            .addCase(loadBoard.fulfilled, (state, action) => {
                const payload: ITaskEntity[] = action.payload ?? []
                const newPlan = payload.filter((task) => task.column_name === 'plan')
                const newProcess = payload.filter((task) => task.column_name === 'process')
                const newReady = payload.filter((task) => task.column_name === 'ready')

                state.board = {
                    plan: [],
                    process: [],
                    ready: [],
                }

                newPlan.sort((a, b) => a.position - b.position).map((task) => {
                    state.board.plan.push(task.title)
                })
                newProcess.sort((a, b) => a.position - b.position).map((task) => {
                    state.board.process.push(task.title)
                })
                newReady.sort((a, b) => a.position - b.position).map((task) => {
                    state.board.ready.push(task.title)
                })
            })

    }

})

export default boardSlice.reducer
export const {
    addNewTask,
    deleteTask,
    moveTask
} = boardSlice.actions