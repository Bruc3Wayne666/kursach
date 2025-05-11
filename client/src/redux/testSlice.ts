// features/tests/testSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

interface Test {
    id: number;
    title: string;
    type: string;
    description: string;
    questionIds: number[];
}

interface Question {
    id: number;
    question: string;
    correct_answer: string;
}

interface TestsState {
    tests: Test[];
    loading: boolean;
    error: string | null;
    test: Test | null; // To store fetched test details
    questions: Question[]; // To store fetched questions
    report: string | null; // To store fetched report
}

const initialState: TestsState = {
    tests: [],
    loading: false,
    error: null,
    test: null,
    questions: [],
    report: null, // Initialize report state
};

// Асинхронное действие для получения тестов
export const fetchTests = createAsyncThunk('tests/fetchTests', async () => {
    const response = await axios.get('http://localhost:3000/tests');
    return response.data;
});

// Асинхронное действие для получения деталей теста
export const fetchTestDetails = createAsyncThunk('tests/fetchTestDetails', async (id: string) => {
    const response = await axios.get(`http://localhost:3000/tests/${id}`);
    return response.data;
});

// Асинхронное действие для получения вопросов теста
export const fetchTestQuestions = createAsyncThunk('tests/fetchTestQuestions', async (id: string) => {
    const response = await axios.get(`http://localhost:3000/tests/${id}/questions`);
    return response.data;
});

// Асинхронное действие для создания теста
export const createTest = createAsyncThunk('tests/createTest', async (test: Omit<Test, 'id'>) => {
    const response = await axios.post('http://localhost:3000/tests', test);
    return response.data;
});

// Асинхронное действие для сохранения результатов теста
export const submitTestResults = createAsyncThunk('tests/submitTestResults', async (results: any[]) => {
    const response = await axios.post('http://localhost:3000/results', results);
    return response.data; // Return the response data if needed
});

// Асинхронное действие для получения отчета
export const fetchReport = createAsyncThunk('tests/fetchReport', async (testId: string) => {
    const response = await axios.get(`http://localhost:3000/reports/${testId}`); // Замените на ваш реальный URL
    return response.data; // Предполагается, что ответ содержит текст отчета
});

const testSlice = createSlice({
    name: 'tests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTests.fulfilled, (state, action) => {
                state.loading = false;
                state.tests = action.payload;
            })
            .addCase(fetchTests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка при получении тестов';
            })
            .addCase(fetchTestDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTestDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.test = action.payload; // Store the fetched test details
            })
            .addCase(fetchTestDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка при получении деталей теста';
            })
            .addCase(fetchTestQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTestQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload; // Store the fetched questions
            })
            .addCase(fetchTestQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка при получении вопросов теста';
            })
            .addCase(submitTestResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitTestResults.fulfilled, (state, action) => {
                state.loading = false;
                state.report = action.payload; // Сохраняем полученный отчет
            })
            .addCase(submitTestResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка при отправке результатов теста';
            })
            // .addCase(fetchReport.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(fetchReport.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.report = action.payload; // Сохраняем полученный отчет
            // })
            // .addCase(fetchReport.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message || 'Ошибка при получении отчета';
            // });
    },
});

export default testSlice.reducer;
