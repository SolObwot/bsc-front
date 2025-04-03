import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './courseSlice';
import universityReducer from './universitySlice'; 

const store = configureStore({
  reducer: {
    courses: courseReducer,
    universities: universityReducer, 
  },
});

export default store;
