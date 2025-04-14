import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
    username: string;
}

interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'), // Retrieve user from local storage
    status: 'idle',
    error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials: { username: string; password: string }) => {
    const response = await axios.post('http://localhost:3000/login', credentials);
    return response.data;
});

export const register = createAsyncThunk('auth/register', async (credentials: { username: string; password: string }) => {
    const response = await axios.post('http://localhost:3000/register', credentials);
    return response.data;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            localStorage.removeItem('user'); // Clear user from local storage
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload)); // Save user to local storage
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(register.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload)); // Save user to local storage
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
