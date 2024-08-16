
import { createSlice } from "@reduxjs/toolkit";

export type InitialStateType = {
        isLoggedIn: boolean;
}

const initialState:InitialStateType = {
        isLoggedIn: false,
};

const authSlice = createSlice({
        name: 'auth',
        initialState,
        reducers: {
                login: (state, action) => {
                        localStorage.setItem('token', action.payload);
                        state.isLoggedIn = true;
                },
                logout: (state) => {
                        localStorage.removeItem('token');
                        state.isLoggedIn = false;
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