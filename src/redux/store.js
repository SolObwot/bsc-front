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
        warnAfter: 128,
        ignoredActions: [
          'strategicObjectives/create/pending',
          'strategicObjectives/create/fulfilled',
          'strategicObjectives/create/rejected'
        ],
        ignoredPaths: ['some.path.in.state'],
      },
    }),
});

export default store;
