import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './courseSlice';
import universityReducer from './universitySlice'; 
import jobTitleReducer from './jobTitleSlice';

const store = configureStore({
  reducer: {
    courses: courseReducer,
    universities: universityReducer, 
    jobTitles: jobTitleReducer,
  },
});

export default store;
