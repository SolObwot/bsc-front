import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { villageService } from "../services/village.service";

export const fetchVillages = createAsyncThunk("villages/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await villageService.getVillages();
    return response.data?.villages ?? response.data ?? [];
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createVillage = createAsyncThunk("villages/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await villageService.createVillage(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateVillage = createAsyncThunk("villages/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await villageService.updateVillage(id, formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteVillage = createAsyncThunk("villages/delete", async (id, { rejectWithValue }) => {
  try {
    await villageService.deleteVillage(id);
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const villageSlice = createSlice({
  name: "villages",
  initialState: {
    allVillages: [],
    currentVillage: null,
    loading: false,
    error: null,
  },
  reducers: {
    deleteVillageFromState: (state, action) => {
      state.allVillages = state.allVillages.filter((v) => v.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVillages.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchVillages.fulfilled, (state, action) => {
        state.loading = false;
        state.allVillages = Array.isArray(action.payload) ? action.payload : action.payload?.data?.villages || [];
      })
      .addCase(fetchVillages.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(createVillage.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createVillage.fulfilled, (state, action) => { state.loading = false; if (action.payload) state.allVillages.unshift(action.payload); })
      .addCase(createVillage.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(updateVillage.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateVillage.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (updated && updated.id) state.allVillages = state.allVillages.map(v => v.id === updated.id ? updated : v);
      })
      .addCase(updateVillage.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(deleteVillage.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteVillage.fulfilled, (state, action) => {
        state.loading = false;
        state.allVillages = state.allVillages.filter(v => v.id !== action.payload);
      })
      .addCase(deleteVillage.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; });
  },
});

export const { deleteVillageFromState } = villageSlice.actions;
export default villageSlice.reducer;
