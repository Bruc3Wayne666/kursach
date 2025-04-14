import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import questionReducer from './questionSlice';
import testReducer from './testSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        questions: questionReducer,
        tests: testReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
