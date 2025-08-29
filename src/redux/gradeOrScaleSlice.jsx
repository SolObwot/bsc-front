import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import gradeOrScaleService from "../services/gradeOrScale.service";

// Fetch all grades/scales
export const fetchGradeOrScales = createAsyncThunk(
  "gradeOrScale/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // Use correct service method and unwrap data
      const response = await gradeOrScaleService.getGradesOrScales();
      return response.data; // .data contains the array
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  }
);

// Create
export const createGradeOrScale = createAsyncThunk(
  "gradeOrScale/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await gradeOrScaleService.createGradeOrScale(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create");
    }
  }
);

// Update
export const updateGradeOrScale = createAsyncThunk(
  "gradeOrScale/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await gradeOrScaleService.updateGradeOrScale(id, formData);
      return response.data; // <-- Always return the updated object, not the raw response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update");
    }
  }
);

// Delete
export const deleteGradeOrScale = createAsyncThunk(
  "gradeOrScale/delete",
  async (id, { rejectWithValue }) => {
    try {
      await gradeOrScaleService.deleteGradeOrScale(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete");
    }
  }
);

const gradeOrScaleSlice = createSlice({
  name: "gradeOrScale",
  initialState: {
    allGradeOrScales: [],
    loading: false,
    error: null,
  },
  reducers: {
    deleteGradeOrScaleFromState: (state, action) => {
      state.allGradeOrScales = state.allGradeOrScales.filter(
        (item) => item.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGradeOrScales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGradeOrScales.fulfilled, (state, action) => {
        state.loading = false;
        state.allGradeOrScales = action.payload;
      })
      .addCase(fetchGradeOrScales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGradeOrScale.fulfilled, (state, action) => {
        console.log("Slice: createGradeOrScale.fulfilled payload", action.payload);
        state.allGradeOrScales.push(action.payload);
        console.log("Slice: allGradeOrScales after create", state.allGradeOrScales);
      })
      .addCase(updateGradeOrScale.fulfilled, (state, action) => {
        // Defensive: Only update if payload is defined and has an id
        console.log("BEFORE UPDATE - action.payload:", action.payload);
        console.log("BEFORE UPDATE - state.allGradeOrScales:", [...state.allGradeOrScales]);
        if (action.payload && action.payload.id !== undefined) {
          state.allGradeOrScales = state.allGradeOrScales.map(item =>
            item.id === action.payload.id ? action.payload : item
          );
        }
        console.log("AFTER UPDATE - state.allGradeOrScales:", [...state.allGradeOrScales]);
      })
      .addCase(deleteGradeOrScale.fulfilled, (state, action) => {
        console.log("BEFORE DELETE - action.payload", action.payload);
        console.log("BEFORE DELETE - state.allGradeOrScales:", [...state.allGradeOrScales]);
        console.log("Slice: deleteGradeOrScale.fulfilled payload", action.payload);
        state.allGradeOrScales = state.allGradeOrScales.filter(item => item.id !== action.payload);
        console.log("AFTER DELETE - state.allGradeOrScales:", [...state.allGradeOrScales]);
        console.log("Slice: allGradeOrScales after delete", state.allGradeOrScales);
      });
  },
});

export const { deleteGradeOrScaleFromState } = gradeOrScaleSlice.actions;

export default gradeOrScaleSlice.reducer;
