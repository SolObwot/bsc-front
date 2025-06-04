import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { strategicObjectiveService } from '../services/strategicObjective.service';
import { handleApiError } from '../services/apiHandler';

export const fetchStrategicObjectives = createAsyncThunk(
  'strategicObjectives/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await strategicObjectiveService.getDepartmentObjectives(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createStrategicObjective = createAsyncThunk(
  'strategicObjectives/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await strategicObjectiveService.createStrategicObjective(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateStrategicObjective = createAsyncThunk(
  'strategicObjectives/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await strategicObjectiveService.updateStrategicObjective(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteStrategicObjective = createAsyncThunk(
  'strategicObjectives/delete',
  async (id, { rejectWithValue }) => {
    try {
      await strategicObjectiveService.deleteStrategicObjective(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchStrategicObjective = createAsyncThunk(
  'strategicObjectives/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await strategicObjectiveService.getStrategicObjective(id);
      
      // Ensure we're returning the correct data structure
      const objectiveData = response.data.data || response.data;
      return objectiveData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const approveStrategicObjective = createAsyncThunk(
  'strategicObjectives/approve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await strategicObjectiveService.approveStrategicObjective(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const rejectStrategicObjective = createAsyncThunk(
  'strategicObjectives/reject',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await strategicObjectiveService.rejectStrategicObjective(id, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const strategicObjectiveSlice = createSlice({
  name: 'strategicObjectives',
  initialState: {
    data: {
      departments: [],
      flattenedObjectives: [] // New flattened structure for all objectives
    },
    currentObjective: null,
    loading: false,
    error: null,
  },
  reducers: {
    deleteObjectiveFromState: (state, action) => {
      state.data.flattenedObjectives = state.data.flattenedObjectives.filter(objective => objective.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStrategicObjectives.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStrategicObjectives.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle the API response structure
        if (action.payload && action.payload.success === true) {
          // If the API returns an array of departments with objectives
          if (Array.isArray(action.payload.data)) {
            // Store the original department data
            state.data.departments = action.payload.data;
            
            // Flatten all objectives from all departments for easier listing and filtering
            let allObjectives = [];
            action.payload.data.forEach(dept => {
              if (dept.objectives && Array.isArray(dept.objectives)) {
                // Add department information to each objective for display
                const objectivesWithDept = dept.objectives.map(obj => ({
                  ...obj,
                  department_name: dept.department?.name || 'Unknown Department',
                  department_id: dept.department?.id || obj.department_id
                }));
                allObjectives = [...allObjectives, ...objectivesWithDept];
              }
            });
            
            state.data.flattenedObjectives = allObjectives;
          } else {
            // Handle legacy format (single department with objectives)
            state.data.departments = [action.payload.department || { objectives: action.payload.data }];
            state.data.flattenedObjectives = action.payload.data || [];
          }
        } else if (Array.isArray(action.payload)) {
          // Direct array of objectives
          state.data.flattenedObjectives = action.payload;
          state.data.departments = [];
        } else {
          // Empty state for unexpected structure
          state.data.departments = [];
          state.data.flattenedObjectives = [];
        }
      })
      .addCase(fetchStrategicObjectives.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch strategic objectives';
      })
      .addCase(createStrategicObjective.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStrategicObjective.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createStrategicObjective.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(updateStrategicObjective.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStrategicObjective.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStrategicObjective.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(deleteStrategicObjective.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStrategicObjective.fulfilled, (state, action) => {
        state.loading = false;
        state.data.flattenedObjectives = state.data.flattenedObjectives.filter(objective => objective.id !== action.payload);
      })
      .addCase(deleteStrategicObjective.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(fetchStrategicObjective.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStrategicObjective.fulfilled, (state, action) => {
        state.currentObjective = action.payload;
        state.loading = false;
      })
      .addCase(fetchStrategicObjective.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(approveStrategicObjective.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveStrategicObjective.fulfilled, (state, action) => {
        state.loading = false;
        const updatedObjective = action.payload;
        state.data.flattenedObjectives = state.data.flattenedObjectives.map(objective => 
          objective.id === updatedObjective.id ? updatedObjective : objective
        );
      })
      .addCase(approveStrategicObjective.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(rejectStrategicObjective.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectStrategicObjective.fulfilled, (state, action) => {
        state.loading = false;
        const updatedObjective = action.payload;
        state.data.flattenedObjectives = state.data.flattenedObjectives.map(objective => 
          objective.id === updatedObjective.id ? updatedObjective : objective
        );
      })
      .addCase(rejectStrategicObjective.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      });
  },
});

export const { deleteObjectiveFromState } = strategicObjectiveSlice.actions;
export default strategicObjectiveSlice.reducer;
