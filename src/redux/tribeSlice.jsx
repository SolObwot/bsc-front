import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tribeService } from '../services/tribe.service';

export const fetchTribes = createAsyncThunk(
  'tribes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tribeService.getTribes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTribe = createAsyncThunk(
  'tribes/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tribeService.getTribe(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTribe = createAsyncThunk(
  'tribes/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await tribeService.createTribe(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTribe = createAsyncThunk(
  'tribes/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await tribeService.updateTribe(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTribe = createAsyncThunk(
  'tribes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await tribeService.deleteTribe(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const tribeSlice = createSlice({
  name: 'tribes',
  initialState: {
    allTribes: [],
    currentTribe: null,
    loading: false,
    error: null,
  },
  reducers: {
    deleteTribeFromState: (state, action) => {
      state.allTribes = state.allTribes.filter(
        (tribe) => tribe.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tribes
      .addCase(fetchTribes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTribes.fulfilled, (state, action) => {
        state.loading = false;
        state.allTribes = action.payload.tribes || [];
      })
      .addCase(fetchTribes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tribes';
      })
      // Fetch single tribe
      .addCase(fetchTribe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTribe.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTribe = action.payload.tribe || {};
      })
      .addCase(fetchTribe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tribe';
      })
      // Create tribe
      .addCase(createTribe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTribe.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.tribe) {
          state.allTribes.push(action.payload.tribe);
        }
      })
      .addCase(createTribe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create tribe';
      })
      // Update tribe
      .addCase(updateTribe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTribe.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.tribe) {
          const index = state.allTribes.findIndex(
            (tribe) => tribe.id === action.payload.tribe.id
          );
          if (index !== -1) {
            state.allTribes[index] = action.payload.tribe;
          }
        }
      })
      .addCase(updateTribe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update tribe';
      })
      // Delete tribe
      .addCase(deleteTribe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTribe.fulfilled, (state, action) => {
        state.loading = false;
        state.allTribes = state.allTribes.filter(
          (tribe) => tribe.id !== action.payload
        );
      })
      .addCase(deleteTribe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete tribe';
      });
  },
});

export const { deleteTribeFromState } = tribeSlice.actions;
export default tribeSlice.reducer;
