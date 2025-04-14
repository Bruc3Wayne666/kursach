// src/redux/questionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

// Создание асинхронного действия для получения вопросов
export const fetchQuestionsAsync = createAsyncThunk(
    'questions/fetchQuestions',
    async () => {
        const response = await axios.get('http://localhost:3000/questions');
        return response.data; // Возвращаем список вопросов
    }
);

// Создание асинхронного действия для добавления вопроса
export const addQuestionAsync = createAsyncThunk(
    'questions/addQuestion',
    async (newQuestion) => {
        const response = await axios.post('http://localhost:3000/questions', newQuestion);
        return response.data; // Возвращаем созданный вопрос
    }
);

const questionSlice = createSlice({
    name: 'questions',
    initialState: {
        questions: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestionsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestionsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload; // Сохраняем полученные вопросы
            })
            .addCase(fetchQuestionsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка при загрузке вопросов';
            })
            .addCase(addQuestionAsync.fulfilled, (state, action) => {
                state.questions.push(action.payload); // Добавляем новый вопрос в массив
            });
    },
});

export default questionSlice.reducer;
