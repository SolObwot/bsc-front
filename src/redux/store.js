import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './courseSlice';
import universityReducer from './universitySlice'; 
import jobTitleReducer from './jobTitleSlice';
import templateReducer from './templateSlice';
import strategicObjectiveReducer from './strategicObjectiveSlice';

const store = configureStore({
  reducer: {
    courses: courseReducer,
    universities: universityReducer, 
    jobTitles: jobTitleReducer,
    templates: templateReducer,
    strategicObjectives: strategicObjectiveReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Increase the threshold to avoid performance issues
        warnAfter: 128,
        // Ignore specific action types or paths in the state if needed
        ignoredActions: ['some/action/type'],
        ignoredPaths: ['some.path.in.state'],
      },
    }),
});

export default store;
