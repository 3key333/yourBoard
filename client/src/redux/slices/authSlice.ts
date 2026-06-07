import { createSlice } from "@reduxjs/toolkit";


interface AuthState {
    user: {
        id: string,
        name: string,
    };
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: {
        id: '',
        name: '',
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
        }

    }
})


export default authSlice.reducer