import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './courseSlice';
import universityReducer from './universitySlice'; 
import jobTitleReducer from './jobTitleSlice';
import templateReducer from './templateSlice';
import strategicObjectiveReducer from './strategicObjectiveSlice';
import strategyPerspectiveReducer from './strategyPerspectiveSlice';
import agreementReducer from './agreementSlice';
import performanceMeasureReducer from './performanceMeasureSlice';
import gradeOrScaleReducer from './gradeOrScaleSlice';
import employmentStatusReducer from './employmentStatusSlice';
import departmentReducer from './departmentSlice';
import relationReducer from './relationSlice';
import unitOrBranchReducer from './unitOrBranchSlice';
import districtReducer from './districtSlice';
import countyReducer from './countySlice';
import subCountiesReducer from './subCountiesSlice';
import parishReducer from './parishSlice'; 
import villageReducer from './villageSlice'; 
import regionReducer from './regionSlice';
import tribeReducer from './tribeSlice';
import userReducer from './userSlice';
import employeeReducer from './employeeSlice';
import appraisalReducer from './appraisalSlice';

const store = configureStore({
  reducer: {
    courses: courseReducer,
    universities: universityReducer, 
    jobTitles: jobTitleReducer,
    departments: departmentReducer,
    unitOrBranches: unitOrBranchReducer,
    templates: templateReducer,
    strategicObjectives: strategicObjectiveReducer,
    strategyPerspective: strategyPerspectiveReducer,
    agreements: agreementReducer,
    appraisals: appraisalReducer,
    performanceMeasure: performanceMeasureReducer,
    gradeOrScale: gradeOrScaleReducer,
    employmentStatuses: employmentStatusReducer,
    departments: departmentReducer,
    relations: relationReducer,
    districts: districtReducer,
    counties: countyReducer,
    subCounties: subCountiesReducer,
    parishes: parishReducer, 
    villages: villageReducer, 
    regions: regionReducer,
    tribes: tribeReducer,
    users: userReducer,
    employee: employeeReducer,
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
