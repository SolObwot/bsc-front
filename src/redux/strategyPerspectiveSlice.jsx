import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { strategyPerspectiveService } from '../services/strategyPerspective.service';
import { handleApiError } from '../services/apiHandler';

// Fetch all department weights
export const fetchDepartmentWeights = createAsyncThunk(
  'strategyPerspective/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await strategyPerspectiveService.getDepartmentWeights();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fetch a specific department weight
export const fetchDepartmentWeight = createAsyncThunk(
  'strategyPerspective/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await strategyPerspectiveService.getDepartmentWeight(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create a new department weight
export const createDepartmentWeight = createAsyncThunk(
  'strategyPerspective/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await strategyPerspectiveService.createDepartmentWeight(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update a department weight
export const updateDepartmentWeight = createAsyncThunk(
  'strategyPerspective/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await strategyPerspectiveService.updateDepartmentWeight(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Delete a department weight
export const deleteDepartmentWeight = createAsyncThunk(
  'strategyPerspective/delete',
  async (id, { rejectWithValue }) => {
    try {
      await strategyPerspectiveService.deleteDepartmentWeight(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Approve a department weight
export const approveDepartmentWeight = createAsyncThunk(
  'strategyPerspective/approve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await strategyPerspectiveService.approveDepartmentWeight(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Reject a department weight
export const rejectDepartmentWeight = createAsyncThunk(
  'strategyPerspective/reject',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await strategyPerspectiveService.rejectDepartmentWeight(id, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const strategyPerspectiveSlice = createSlice({
  name: 'strategyPerspective',
  initialState: {
    departments: [],
    currentWeight: null,
    loading: false,
    error: null,
  },
  reducers: {
    deleteDepartmentWeightFromState: (state, action) => {
      state.departments = state.departments.map(dept => {
        if (dept.active_weights) {
          dept.active_weights = dept.active_weights.filter(weight => weight.id !== action.payload);
        }
        return dept;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchDepartmentWeights
      .addCase(fetchDepartmentWeights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentWeights.fulfilled, (state, action) => {
        state.loading = false;
        
        // Extract direct array of weights if exists
        if (action.payload && action.payload.data && Array.isArray(action.payload.data)) {
          if (action.payload.data.length > 0 && action.payload.data[0].active_weights) {
            // Response contains departments with active_weights
            state.departments = action.payload.data;
          } else {
            // Response might be a direct array of weights
            // Group them by department_id
            const weightsByDepartment = action.payload.data.reduce((acc, weight) => {
              const deptId = weight.department_id;
              if (!acc[deptId]) {
                acc[deptId] = {
                  id: deptId,
                  name: weight.department?.name || 'Department ' + deptId,
                  active_weights: []
                };
              }
              acc[deptId].active_weights.push(weight);
              return acc;
            }, {});
            
            state.departments = Object.values(weightsByDepartment);
          }
        } else if (Array.isArray(action.payload)) {
          // Direct array in the response
          state.departments = action.payload;
        } else {
          // Single object or unknown structure
          state.departments = action.payload ? [action.payload] : [];
        }
      })
      .addCase(fetchDepartmentWeights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch department weights';
      })
      
      // Handle fetchDepartmentWeight
      .addCase(fetchDepartmentWeight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentWeight.fulfilled, (state, action) => {
        state.currentWeight = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchDepartmentWeight.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      
      // Handle createDepartmentWeight
      .addCase(createDepartmentWeight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepartmentWeight.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createDepartmentWeight.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      
      // Handle updateDepartmentWeight
      .addCase(updateDepartmentWeight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartmentWeight.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateDepartmentWeight.rejected, (state, action) => {
        const errorMessage = action.payload?.response?.data?.message || action.error.message || 'Failed to update department weight';
        state.error = errorMessage;
        state.loading = false;
        handleApiError(action.payload);
      })
      
      // Handle deleteDepartmentWeight
      .addCase(deleteDepartmentWeight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartmentWeight.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = state.departments.map(dept => {
          if (dept.active_weights) {
            dept.active_weights = dept.active_weights.filter(weight => weight.id !== action.payload);
          }
          return dept;
        });
      })
      .addCase(deleteDepartmentWeight.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      
      // Handle approveDepartmentWeight
      .addCase(approveDepartmentWeight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveDepartmentWeight.fulfilled, (state, action) => {
        state.loading = false;
        // Update the weight in the departments array
        const updatedWeight = action.payload;
        state.departments = state.departments.map(dept => {
          if (dept.active_weights) {
            dept.active_weights = dept.active_weights.map(weight => 
              weight.id === updatedWeight.id ? updatedWeight : weight
            );
          }
          return dept;
        });
      })
      .addCase(approveDepartmentWeight.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      
      // Handle rejectDepartmentWeight
      .addCase(rejectDepartmentWeight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectDepartmentWeight.fulfilled, (state, action) => {
        state.loading = false;
        // Update the weight in the departments array
        const updatedWeight = action.payload;
        state.departments = state.departments.map(dept => {
          if (dept.active_weights) {
            dept.active_weights = dept.active_weights.map(weight => 
              weight.id === updatedWeight.id ? updatedWeight : weight
            );
          }
          return dept;
        });
      })
      .addCase(rejectDepartmentWeight.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      });
  },
});

export const { deleteDepartmentWeightFromState } = strategyPerspectiveSlice.actions;
export default strategyPerspectiveSlice.reducer;
