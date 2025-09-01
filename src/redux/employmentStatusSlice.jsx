import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { employmentStatusService } from '../services/employmentStatus.service';

export const fetchEmploymentStatuses = createAsyncThunk(
  'employmentStatuses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await employmentStatusService.getEmploymentStatuses();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createEmploymentStatus = createAsyncThunk(
  'employmentStatuses/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await employmentStatusService.createEmploymentStatus(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateEmploymentStatus = createAsyncThunk(
  'employmentStatuses/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await employmentStatusService.updateEmploymentStatus(id, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteEmploymentStatus = createAsyncThunk(
  'employmentStatuses/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await employmentStatusService.deleteEmploymentStatus(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const employmentStatusSlice = createSlice({
  name: 'employmentStatuses',
  initialState: {
    allEmploymentStatuses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmploymentStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmploymentStatuses.fulfilled, (state, action) => {
        state.allEmploymentStatuses = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmploymentStatuses.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createEmploymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmploymentStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createEmploymentStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateEmploymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmploymentStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEmploymentStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteEmploymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmploymentStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteEmploymentStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default employmentStatusSlice.reducer;
