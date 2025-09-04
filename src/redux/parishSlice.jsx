import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { parishService } from "../services/parish.service";

export const fetchParishes = createAsyncThunk("parishes/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await parishService.getParishes();
    return response.data?.parishes ?? response.data ?? [];
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createParish = createAsyncThunk("parishes/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await parishService.createParish(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateParish = createAsyncThunk("parishes/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await parishService.updateParish(id, formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteParish = createAsyncThunk("parishes/delete", async (id, { rejectWithValue }) => {
  try {
    await parishService.deleteParish(id);
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const parishSlice = createSlice({
  name: "parishes",
  initialState: {
    allParishes: [],
    currentParish: null,
    loading: false,
    error: null,
  },
  reducers: {
    deleteParishFromState: (state, action) => {
      state.allParishes = state.allParishes.filter((p) => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParishes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchParishes.fulfilled, (state, action) => {
        state.loading = false;
        state.allParishes = Array.isArray(action.payload) ? action.payload : action.payload?.data?.parishes || [];
      })
      .addCase(fetchParishes.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(createParish.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createParish.fulfilled, (state, action) => { state.loading = false; if (action.payload) state.allParishes.unshift(action.payload); })
      .addCase(createParish.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(updateParish.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateParish.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (updated && updated.id) state.allParishes = state.allParishes.map(p => p.id === updated.id ? updated : p);
      })
      .addCase(updateParish.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(deleteParish.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteParish.fulfilled, (state, action) => {
        state.loading = false;
        state.allParishes = state.allParishes.filter(p => p.id !== action.payload);
      })
      .addCase(deleteParish.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; });
  },
});

export const { deleteParishFromState } = parishSlice.actions;
export default parishSlice.reducer;
