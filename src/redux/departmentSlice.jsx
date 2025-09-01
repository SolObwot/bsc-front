import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { departmentService } from "../services/department.service";

export const fetchDepartments = createAsyncThunk("departments/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await departmentService.getDepartments();
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchDepartment = createAsyncThunk("departments/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const response = await departmentService.getDepartment(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createDepartment = createAsyncThunk("departments/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await departmentService.createDepartment(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateDepartment = createAsyncThunk("departments/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await departmentService.updateDepartment(id, formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteDepartment = createAsyncThunk("departments/delete", async (id, { rejectWithValue }) => {
  try {
    await departmentService.deleteDepartment(id);
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const departmentSlice = createSlice({
  name: "departments",
  initialState: {
    currentDepartment: null,
    allDepartments: [],
    loading: false,
    error: null,
  },
  reducers: {
    deleteDepartmentFromState: (state, action) => {
      state.allDepartments = state.allDepartments.filter((department) => department.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.allDepartments = action.payload.data;  // Access the data array from the response
        state.loading = false;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartment.fulfilled, (state, action) => {
        state.currentDepartment = action.payload.data;  // Access the data object from the response
        state.loading = false;
      })
      .addCase(fetchDepartment.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.allDepartments = state.allDepartments.filter((department) => department.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { deleteDepartmentFromState } = departmentSlice.actions;
export default departmentSlice.reducer;
