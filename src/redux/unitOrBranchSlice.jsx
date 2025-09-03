import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { unitOrBranchService } from "../services/unitOrBranch.service";

// Async thunks for CRUD operations
export const fetchUnitOrBranches = createAsyncThunk(
    "unitOrBranch/fetchAll",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await unitOrBranchService.getUnitOrBranches(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUnitOrBranch = createAsyncThunk(
    "unitOrBranch/fetchOne",
    async (id, { rejectWithValue }) => {
        try {
            const response = await unitOrBranchService.getUnitOrBranch(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createUnitOrBranch = createAsyncThunk(
    "unitOrBranch/create",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await unitOrBranchService.createUnitOrBranch(formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateUnitOrBranch = createAsyncThunk(
    "unitOrBranch/update",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await unitOrBranchService.updateUnitOrBranch(id, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteUnitOrBranch = createAsyncThunk(
    "unitOrBranch/delete",
    async (id, { rejectWithValue }) => {
        try {
            await unitOrBranchService.deleteUnitOrBranch(id);
            return id;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const unitOrBranchSlice = createSlice({
    name: "unitOrBranch",
    initialState: {
        currentUnitOrBranch: null,
        allUnitOrBranches: [],
        loading: false,
        error: null,
    },
    reducers: {
        deleteUnitOrBranchFromState: (state, action) => {
            state.allUnitOrBranches = state.allUnitOrBranches.filter(
                (item) => item.id !== action.payload
            );
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnitOrBranches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUnitOrBranches.fulfilled, (state, action) => {
                state.allUnitOrBranches = action.payload.data || [];
                state.loading = false;
            })
            .addCase(fetchUnitOrBranches.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(fetchUnitOrBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUnitOrBranch.fulfilled, (state, action) => {
                state.currentUnitOrBranch = action.payload.data;
                state.loading = false;
            })
            .addCase(fetchUnitOrBranch.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(createUnitOrBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUnitOrBranch.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createUnitOrBranch.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(updateUnitOrBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUnitOrBranch.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateUnitOrBranch.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(deleteUnitOrBranch.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUnitOrBranch.fulfilled, (state, action) => {
                state.allUnitOrBranches = state.allUnitOrBranches.filter(
                    (item) => item.id !== action.payload
                );
                state.loading = false;
            })
            .addCase(deleteUnitOrBranch.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export const { deleteUnitOrBranchFromState, clearError } = unitOrBranchSlice.actions;
export default unitOrBranchSlice.reducer;