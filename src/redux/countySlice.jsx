import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { countyService } from "../services/county.service";

export const fetchCounties = createAsyncThunk("counties/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await countyService.getCounties();
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createCounty = createAsyncThunk("counties/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await countyService.createCounty(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateCounty = createAsyncThunk("counties/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await countyService.updateCounty(id, formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteCounty = createAsyncThunk("counties/delete", async (id, { rejectWithValue }) => {
  try {
    await countyService.deleteCounty(id);
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const countySlice = createSlice({
  name: "counties",
  initialState: {
    allCounties: [],
    currentCounty: null,
    loading: false,
    error: null,
  },
  reducers: {
    deleteCountyFromState: (state, action) => {
      state.allCounties = state.allCounties.filter((c) => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCounties.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCounties.fulfilled, (state, action) => {
        state.loading = false;
        state.allCounties = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
      })
      .addCase(fetchCounties.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(createCounty.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createCounty.fulfilled, (state, action) => { state.loading = false; if (action.payload) state.allCounties.unshift(action.payload); })
      .addCase(createCounty.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(updateCounty.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateCounty.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (updated && updated.id) state.allCounties = state.allCounties.map(c => c.id === updated.id ? updated : c);
      })
      .addCase(updateCounty.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(deleteCounty.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteCounty.fulfilled, (state, action) => {
        state.loading = false;
        state.allCounties = state.allCounties.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCounty.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; });
  },
});

export const { deleteCountyFromState } = countySlice.actions;
export default countySlice.reducer;
