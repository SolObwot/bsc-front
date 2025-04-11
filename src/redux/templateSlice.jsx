import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { templatesService } from '../services/templates.service';

export const fetchTemplates = createAsyncThunk(
  'templates/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await templatesService.getTemplates();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchTemplate = createAsyncThunk(
  'templates/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await templatesService.getTemplate(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createTemplate = createAsyncThunk(
  'templates/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await templatesService.createTemplate(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'templates/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await templatesService.updateTemplate(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'templates/delete',
  async (id, { rejectWithValue }) => {
    try {
      await templatesService.deleteTemplate(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const templateSlice = createSlice({
  name: 'templates',
  initialState: {
    currentTemplate: null,
    allTemplates: [],
    loading: false,
    error: null,
  },
  reducers: {
    deleteTemplateFromState: (state, action) => {
      state.allTemplates = state.allTemplates.filter(template => template.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.allTemplates = action.payload;
        state.loading = false;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplate.fulfilled, (state, action) => {
        state.currentTemplate = action.payload;
        state.loading = false;
      })
      .addCase(fetchTemplate.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.allTemplates = state.allTemplates.filter(template => template.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { deleteTemplateFromState } = templateSlice.actions;
export default templateSlice.reducer;
