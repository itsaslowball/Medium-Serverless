
import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

export type InitialStateType = {
        isLoggedIn: boolean;
        userId: string | null;
}

const initialState:InitialStateType = {
        isLoggedIn: false,
        userId:null,
};

interface DecodedToken {
        id: string;

        
}

const authSlice = createSlice({
        name: 'auth',
        initialState,
        reducers: {
                login: (state, action) => {
                        localStorage.setItem('token', action.payload);
                        state.isLoggedIn = true;
                        const decodedToken = jwtDecode<DecodedToken>(action.payload);
                        state.userId = decodedToken.id;
                        localStorage.setItem('userId', state.userId);

                },
                logout: (state) => {
                        localStorage.removeItem('token');
                        state.isLoggedIn = false;
                        state.userId = null;
                },
                checkLogIn: (state) => {
                        if (localStorage.getItem('token')) {
                                state.isLoggedIn = true;
                        }
                }
        },
});

export const { login, logout, checkLogIn } = authSlice.actions;

export default authSlice.reducer;