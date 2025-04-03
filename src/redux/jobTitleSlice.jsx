import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jobTitleService } from "../services/jobTitle";

export const fetchJobTitles = createAsyncThunk("jobTitles/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await jobTitleService.getJobTitles();
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchJobTitle = createAsyncThunk("jobTitles/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const response = await jobTitleService.getJobTitle(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createJobTitle = createAsyncThunk("jobTitles/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await jobTitleService.createJobTitle(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateJobTitle = createAsyncThunk("jobTitles/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await jobTitleService.updateJobTitle(id, formData);
    return response.data; // Ensure only the data is returned
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const jobTitleSlice = createSlice({
  name: "jobTitles",
  initialState: {
    currentJobTitle: null,
    allJobTitles: [],
    loading: false,
    error: null,
  },
  reducers: {
    deleteJobTitleFromState: (state, action) => {
      state.allJobTitles = state.allJobTitles.filter((jobTitle) => jobTitle.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobTitles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobTitles.fulfilled, (state, action) => {
        state.allJobTitles = action.payload;
        state.loading = false;
      })
      .addCase(fetchJobTitles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchJobTitle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobTitle.fulfilled, (state, action) => {
        state.currentJobTitle = action.payload;
        state.loading = false;
      })
      .addCase(fetchJobTitle.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createJobTitle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobTitle.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createJobTitle.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateJobTitle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobTitle.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateJobTitle.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { deleteJobTitleFromState } = jobTitleSlice.actions;
export default jobTitleSlice.reducer;
