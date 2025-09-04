import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { subCountiesService } from "../services/subCounties.service";

export const fetchSubCounties = createAsyncThunk("subCounties/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await subCountiesService.getSubCounties();
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createSubCounty = createAsyncThunk("subCounties/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await subCountiesService.createSubCounty(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateSubCounty = createAsyncThunk("subCounties/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await subCountiesService.updateSubCounty(id, formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteSubCounty = createAsyncThunk("subCounties/delete", async (id, { rejectWithValue }) => {
  try {
    await subCountiesService.deleteSubCounty(id);
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const subCountiesSlice = createSlice({
  name: "subCounties",
  initialState: {
    allSubCounties: [],
    currentSubCounty: null,
    loading: false,
    error: null,
  },
  reducers: {
    deleteSubCountyFromState: (state, action) => {
      state.allSubCounties = state.allSubCounties.filter((s) => s.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCounties.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSubCounties.fulfilled, (state, action) => {
        state.loading = false;
        state.allSubCounties = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
      })
      .addCase(fetchSubCounties.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(createSubCounty.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createSubCounty.fulfilled, (state, action) => { state.loading = false; if (action.payload) state.allSubCounties.unshift(action.payload); })
      .addCase(createSubCounty.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(updateSubCounty.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateSubCounty.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (updated && updated.id) state.allSubCounties = state.allSubCounties.map(s => s.id === updated.id ? updated : s);
      })
      .addCase(updateSubCounty.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; })

      .addCase(deleteSubCounty.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteSubCounty.fulfilled, (state, action) => {
        state.loading = false;
        state.allSubCounties = state.allSubCounties.filter(s => s.id !== action.payload);
      })
      .addCase(deleteSubCounty.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? action.error?.message; });
  },
});

export const { deleteSubCountyFromState } = subCountiesSlice.actions;
export default subCountiesSlice.reducer;
