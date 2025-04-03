import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { universityService } from '../services/university.service';
import { handleApiError } from '../services/apiHandler';

export const fetchUniversities = createAsyncThunk(
  'universities/fetchUniversities',
  async (params) => {
    const response = await universityService.getUniversities(params);
    return response.data;
  }
);

export const createUniversity = createAsyncThunk(
  'universities/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await universityService.createUniversitiy(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUniversity = createAsyncThunk(
  'universities/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await universityService.updateUniversitiy(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteUniversity = createAsyncThunk(
  'universities/delete',
  async (id, { rejectWithValue }) => {
    try {
      await universityService.deleteUniversitiy(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUniversity = createAsyncThunk(
  'universities/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await universityService.getUniversity(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const universitySlice = createSlice({
  name: 'universities',
  initialState: {
    data: [],
    currentUniversity: null, 
    loading: false,
    error: null,
  },
  reducers: {
    deleteUniversityFromState: (state, action) => {
      state.data = state.data.filter(university => university.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniversities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniversities.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUniversities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUniversity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUniversity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUniversity.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(updateUniversity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUniversity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUniversity.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(deleteUniversity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUniversity.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(university => university.id !== action.payload);
      })
      .addCase(deleteUniversity.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(fetchUniversity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniversity.fulfilled, (state, action) => {
        state.currentUniversity = action.payload;
        state.loading = false;
      })
      .addCase(fetchUniversity.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      });
  },
});

export const { deleteUniversityFromState } = universitySlice.actions;
export default universitySlice.reducer;


