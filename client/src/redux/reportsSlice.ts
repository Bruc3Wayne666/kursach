// features/reportsSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchReports = createAsyncThunk('reports/fetchReports', async (userId) => {
    const response = await axios.get(`http://localhost:3000/reports/${userId}`);
    return response.data;
});

const reportsSlice = createSlice({
    name: 'reports',
    initialState: {
        reports: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default reportsSlice.reducer;
