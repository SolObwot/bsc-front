import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { employeeService } from '../services/employee.service';

// Async thunks for API calls
export const fetchEmployee = createAsyncThunk(
  'employee/fetchEmployee',
  async (id, { rejectWithValue }) => {
    try {
      const response = await employeeService.getEmployee(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employee/createEmployee',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await employeeService.createEmployee(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employee/updateEmployee',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await employeeService.updateEmployee(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  data: null,
  loading: false,
  error: null,
  currentSection: null,
  formState: {},
  wizardStep: 1,
  totalWizardSteps: 5,
};

// Create the slice
const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setCurrentSection: (state, action) => {
      state.currentSection = action.payload;
    },
    updateFormState: (state, action) => {
      state.formState = {
        ...state.formState,
        ...action.payload
      };
    },
    nextWizardStep: (state) => {
      if (state.wizardStep < state.totalWizardSteps) {
        state.wizardStep += 1;
      }
    },
    prevWizardStep: (state) => {
      if (state.wizardStep > 1) {
        state.wizardStep -= 1;
      }
    },
    setWizardStep: (state, action) => {
      if (action.payload >= 1 && action.payload <= state.totalWizardSteps) {
        state.wizardStep = action.payload;
      }
    },
    resetWizard: (state) => {
      state.wizardStep = 1;
      state.formState = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.data = {
          ...state.data,
          ...action.payload,
        };
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      });
  },
});

// Export actions and reducer
export const { 
  setCurrentSection, 
  updateFormState, 
  nextWizardStep, 
  prevWizardStep, 
  setWizardStep,
  resetWizard
} = employeeSlice.actions;

export default employeeSlice.reducer;
