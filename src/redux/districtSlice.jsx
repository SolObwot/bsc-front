import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { districtService } from "../services/distirct.service";

export const fetchDistricts = createAsyncThunk("districts/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await districtService.getDistricts();
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createDistrict = createAsyncThunk("districts/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await districtService.createDistrict(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateDistrict = createAsyncThunk("districts/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await districtService.updateDistrict(id, formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteDistrict = createAsyncThunk("districts/delete", async (id, { rejectWithValue }) => {
  try {
    await districtService.deleteDistrict(id);
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const districtSlice = createSlice({
  name: "districts",
  initialState: {
    allDistricts: [],
    currentDistrict: null,
    loading: false,
    error: null,
  },
  reducers: {
    deleteDistrictFromState: (state, action) => {
      state.allDistricts = state.allDistricts.filter((d) => d.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistricts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.loading = false;
        // Accept either response.data array or wrapper { data: [...] }
        state.allDistricts = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      .addCase(createDistrict.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createDistrict.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.allDistricts.unshift(action.payload);
      })
      .addCase(createDistrict.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      .addCase(updateDistrict.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateDistrict.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (updated && updated.id) {
          state.allDistricts = state.allDistricts.map(d => d.id === updated.id ? updated : d);
        }
      })
      .addCase(updateDistrict.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      .addCase(deleteDistrict.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteDistrict.fulfilled, (state, action) => {
        state.loading = false;
        state.allDistricts = state.allDistricts.filter(d => d.id !== action.payload);
      })
      .addCase(deleteDistrict.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      });
  },
});

export const { deleteDistrictFromState } = districtSlice.actions;
export default districtSlice.reducer;
