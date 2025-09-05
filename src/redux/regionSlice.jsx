import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { regionsService } from '../services/regions.service';

export const fetchRegions = createAsyncThunk(
  'regions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await regionsService.getRegions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRegion = createAsyncThunk(
  'regions/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await regionsService.getRegion(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createRegion = createAsyncThunk(
  'regions/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await regionsService.createRegion(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateRegion = createAsyncThunk(
  'regions/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await regionsService.updateRegion(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRegion = createAsyncThunk(
  'regions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await regionsService.deleteRegion(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const regionSlice = createSlice({
  name: 'regions',
  initialState: {
    allRegions: [],
    currentRegion: null,
    loading: false,
    error: null,
  },
  reducers: {
    deleteRegionFromState: (state, action) => {
      state.allRegions = state.allRegions.filter(
        (region) => region.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all regions
      .addCase(fetchRegions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.loading = false;
        state.allRegions = action.payload.regions || [];
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch regions';
      })
      // Fetch single region
      .addCase(fetchRegion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegion.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRegion = action.payload.region || {};
      })
      .addCase(fetchRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch region';
      })
      // Create region
      .addCase(createRegion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRegion.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.region) {
          state.allRegions.push(action.payload.region);
        }
      })
      .addCase(createRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create region';
      })
      // Update region
      .addCase(updateRegion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRegion.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.region) {
          const index = state.allRegions.findIndex(
            (region) => region.id === action.payload.region.id
          );
          if (index !== -1) {
            state.allRegions[index] = action.payload.region;
          }
        }
      })
      .addCase(updateRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update region';
      })
      // Delete region
      .addCase(deleteRegion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRegion.fulfilled, (state, action) => {
        state.loading = false;
        state.allRegions = state.allRegions.filter(
          (region) => region.id !== action.payload
        );
      })
      .addCase(deleteRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete region';
      });
  },
});

export const { deleteRegionFromState } = regionSlice.actions;
export default regionSlice.reducer;
