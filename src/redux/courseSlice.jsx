import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { courseService } from '../services/course.service';
import { handleApiError } from '../services/apiHandler';

export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await courseService.getCourses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCourse = createAsyncThunk(
  'courses/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await courseService.getCourse(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await courseService.updateCourse(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await courseService.createCourse(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    currentCourse: null,
    allCourses: [],
    loading: false,
    error: null
  },
  reducers: {
    deleteCourseFromState: (state, action) => {
      state.allCourses = state.allCourses.filter(course => course.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.allCourses = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(fetchCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.currentCourse = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      });
  }
});

export const { deleteCourseFromState } = courseSlice.actions;
export default courseSlice.reducer;