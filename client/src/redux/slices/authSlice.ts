import { createSlice } from "@reduxjs/toolkit";


interface AuthState {
    user: {
        id: string,
        name: string,
        room: string,
    };
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: {
        id: '',
        name: '',
        room: '',
    },
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        setUserInfo: (state, action) => {
            state.user = action.payload

            localStorage.setItem('userInfo', JSON.stringify(state.user))
        },

        setUserRoom: (state, action) => {
            state.user.room = action.payload

            localStorage.setItem('userInfo', JSON.stringify(state.user))
        }

    }
})


export default authSlice.reducer
export const { 
    setUserInfo,
    setUserRoom,
} = authSlice.actions