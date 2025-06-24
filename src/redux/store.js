import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './courseSlice';
import universityReducer from './universitySlice'; 
import jobTitleReducer from './jobTitleSlice';
import templateReducer from './templateSlice';
import strategicObjectiveReducer from './strategicObjectiveSlice';
import strategyPerspectiveReducer from './strategyPerspectiveSlice';
import agreementReducer from './agreementSlice';
import performanceMeasureReducer from './performanceMeasureSlice';

const store = configureStore({
  reducer: {
    courses: courseReducer,
    universities: universityReducer, 
    jobTitles: jobTitleReducer,
    templates: templateReducer,
    strategicObjectives: strategicObjectiveReducer,
    strategyPerspective: strategyPerspectiveReducer,
    agreements: agreementReducer,
    performanceMeasure: performanceMeasureReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 128,
        ignoredActions: [
          'strategicObjectives/create/pending',
          'strategicObjectives/create/fulfilled',
          'strategicObjectives/create/rejected',
          'strategyPerspective/create/pending',
          'strategyPerspective/create/fulfilled',
          'strategyPerspective/create/rejected',
          'performanceMeasure/createPerformanceMeasure/pending',
          'performanceMeasure/createPerformanceMeasure/fulfilled',
          'performanceMeasure/createPerformanceMeasure/rejected',
          'performanceMeasure/updatePerformanceMeasure/pending',
          'performanceMeasure/updatePerformanceMeasure/fulfilled',
          'performanceMeasure/updatePerformanceMeasure/rejected',
          'performanceMeasure/deletePerformanceMeasure/pending',
          'performanceMeasure/deletePerformanceMeasure/fulfilled',
          'performanceMeasure/deletePerformanceMeasure/rejected',
        ],
        ignoredPaths: ['some.path.in.state'],
      },
    }),
});

export default store;
