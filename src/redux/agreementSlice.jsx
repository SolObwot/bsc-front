import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { agreementService } from '../services/agreement.service';
import { handleApiError } from '../services/apiHandler';

export const fetchAgreements = createAsyncThunk(
  'agreements/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await agreementService.getAgreements(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAgreement = createAsyncThunk(
  'agreements/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await agreementService.getAgreement(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createAgreement = createAsyncThunk(
  'agreements/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await agreementService.createAgreement(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateAgreement = createAsyncThunk(
  'agreements/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await agreementService.updateAgreement(id, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAgreement = createAsyncThunk(
  'agreements/delete',
  async (id, { rejectWithValue }) => {
    try {
      await agreementService.deleteAgreement(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const submitAgreement = createAsyncThunk(
  'agreements/submit',
  async (id, { rejectWithValue }) => {
    try {
      const response = await agreementService.submitAgreement(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const supervisorApproveAgreement = createAsyncThunk(
  'agreements/supervisorApprove',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await agreementService.supervisorApproval(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const hodApproveAgreement = createAsyncThunk(
  'agreements/hodApprove',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await agreementService.hodApproval(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const agreementSlice = createSlice({
  name: 'agreements',
  initialState: {
    agreements: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      perPage: 20,
      total: 0
    },
    currentAgreement: null,
    loading: false,
    error: null,
  },
  reducers: {
    deleteAgreementFromState: (state, action) => {
      state.agreements = state.agreements.filter(agreement => agreement.id !== action.payload);
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all agreements
      .addCase(fetchAgreements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgreements.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle the paginated response
        if (action.payload && action.payload.data) {
          state.agreements = action.payload.data;
          state.pagination = {
            currentPage: action.payload.current_page,
            totalPages: action.payload.last_page,
            perPage: action.payload.per_page,
            total: action.payload.total
          };
        } else {
          state.agreements = [];
          state.pagination = {
            currentPage: 1,
            totalPages: 1,
            perPage: 20,
            total: 0
          };
        }
      })
      .addCase(fetchAgreements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch agreements';
        handleApiError(action.payload);
      })
      
      // Fetch one agreement
      .addCase(fetchAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgreement.fulfilled, (state, action) => {
        state.currentAgreement = action.payload;
        state.loading = false;
      })
      .addCase(fetchAgreement.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      
      // Create agreement
      .addCase(createAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgreement.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAgreement.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      
      // Update agreement
      .addCase(updateAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAgreement.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAgreement.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      
      // Delete agreement
      .addCase(deleteAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAgreement.fulfilled, (state, action) => {
        state.loading = false;
        state.agreements = state.agreements.filter(agreement => agreement.id !== action.payload);
      })
      .addCase(deleteAgreement.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      
      // Submit agreement
      .addCase(submitAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAgreement.fulfilled, (state, action) => {
         state.loading = false;
            let updatedAgreement;
            
            if (action.payload && action.payload.data) {
                updatedAgreement = action.payload.data;
            } else if (action.payload && action.payload.id) {
                updatedAgreement = action.payload;
            } else {
                return;
            }
                state.agreements = state.agreements.map(agreement => 
                agreement.id === updatedAgreement.id ? updatedAgreement : agreement
            );
        })
      .addCase(submitAgreement.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      
      // Supervisor approval
      .addCase(supervisorApproveAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(supervisorApproveAgreement.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAgreement = action.payload.data;
        state.agreements = state.agreements.map(agreement => 
          agreement.id === updatedAgreement.id ? updatedAgreement : agreement
        );
      })
      .addCase(supervisorApproveAgreement.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      
      // HOD approval
      .addCase(hodApproveAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hodApproveAgreement.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAgreement = action.payload.data;
        state.agreements = state.agreements.map(agreement => 
          agreement.id === updatedAgreement.id ? updatedAgreement : agreement
        );
      })
      .addCase(hodApproveAgreement.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      });
  },
});

export const { deleteAgreementFromState, setCurrentPage } = agreementSlice.actions;
export default agreementSlice.reducer;