import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { performanceMeasureService } from '../services/performanceMeasure.service';

// Async thunks
export const fetchDepartmentObjectives = createAsyncThunk(
    'performanceMeasure/fetchDepartmentObjectives',
    async (_, { rejectWithValue }) => {
        try {
            const response = await performanceMeasureService.getDepartmentObjectives();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const fetchPerformanceMeasures = createAsyncThunk(
    'performanceMeasure/fetchPerformanceMeasures',
    async (params = { page: 1 }, { rejectWithValue }) => {
        try {
            const response = await performanceMeasureService.getPerformanceMeasures(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Fetch ALL performance measures across all pages concurrently
export const fetchAllPerformanceMeasures = createAsyncThunk(
    'performanceMeasure/fetchAllPerformanceMeasures',
    async (params, { rejectWithValue }) => {
        try {
            // Fetch the first page to get pagination metadata
            const firstPageResponse = await performanceMeasureService.getPerformanceMeasures({
                ...params,
                page: 1,
            });
            const totalPages = firstPageResponse.last_page;
            let allMeasures = firstPageResponse.data;

            // If there is more than one page, fetch the rest
            if (totalPages > 1) {
                const pagePromises = [];
                for (let page = 2; page <= totalPages; page++) {
                    pagePromises.push(
                        performanceMeasureService.getPerformanceMeasures({ ...params, page })
                    );
                }
                // Fetch all remaining pages concurrently
                const subsequentPageResponses = await Promise.all(pagePromises);
                const subsequentMeasures = subsequentPageResponses.flatMap(
                    (response) => response.data
                );
                allMeasures = [...allMeasures, ...subsequentMeasures];
            }

            // Return the complete, aggregated list of performance measures
            return allMeasures;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);


export const createPerformanceMeasure = createAsyncThunk(
    'performanceMeasure/createPerformanceMeasure',
    async (measureData, { rejectWithValue }) => {
        try {
            const response = await performanceMeasureService.createPerformanceMeasure(measureData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const updatePerformanceMeasure = createAsyncThunk(
    'performanceMeasure/updatePerformanceMeasure',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await performanceMeasureService.updatePerformanceMeasure(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const deletePerformanceMeasure = createAsyncThunk(
    'performanceMeasure/deletePerformanceMeasure',
    async (id, { rejectWithValue }) => {
        try {
            await performanceMeasureService.deletePerformanceMeasure(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Initial state
const initialState = {
    department: null,
    perspectives: [],
    measures: {
        data: [],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            perPage: 20
        }
    },
    allPerformanceMeasures: [], // New field for storing all measures
    loading: {
        department: false,
        measures: false,
        allMeasures: false, // New loading state
        create: false,
        update: false,
        delete: false
    },
    error: {
        department: null,
        measures: null,
        allMeasures: null, // New error state
        create: null,
        update: null,
        delete: null
    }
};

// Slice
const performanceMeasureSlice = createSlice({
    name: 'performanceMeasure',
    initialState,
    reducers: {
        resetErrors: (state) => {
            state.error = {
                department: null,
                measures: null,
                allMeasures: null,
                create: null,
                update: null,
                delete: null
            };
        },
        setCurrentPage: (state, action) => {
            state.measures.pagination.currentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Department objectives
        builder.addCase(fetchDepartmentObjectives.pending, (state) => {
            state.loading.department = true;
            state.error.department = null;
        });
        builder.addCase(fetchDepartmentObjectives.fulfilled, (state, action) => {
            state.loading.department = false;
            state.department = action.payload.department;
            state.perspectives = action.payload.perspectives;
        });
        builder.addCase(fetchDepartmentObjectives.rejected, (state, action) => {
            state.loading.department = false;
            state.error.department = action.payload || { message: 'Failed to fetch department objectives' };
        });
        
        // Performance measures (paginated)
        builder.addCase(fetchPerformanceMeasures.pending, (state) => {
            state.loading.measures = true;
            state.error.measures = null;
        });
        builder.addCase(fetchPerformanceMeasures.fulfilled, (state, action) => {
            state.loading.measures = false;
            state.measures.data = action.payload.data;
            state.measures.pagination = {
                currentPage: action.payload.current_page,
                totalPages: action.payload.last_page,
                totalItems: action.payload.total,
                perPage: action.payload.per_page
            };
        });
        builder.addCase(fetchPerformanceMeasures.rejected, (state, action) => {
            state.loading.measures = false;
            state.error.measures = action.payload || { message: 'Failed to fetch performance measures' };
        });

        // All performance measures (non-paginated)
        builder.addCase(fetchAllPerformanceMeasures.pending, (state) => {
                state.loading.allMeasures = true;
                state.error.allMeasures = null;
            });
        builder.addCase(fetchAllPerformanceMeasures.fulfilled, (state, action) => {
                state.loading.allMeasures = false;
                state.allPerformanceMeasures = action.payload;
            });
        builder.addCase(fetchAllPerformanceMeasures.rejected, (state, action) => {
                state.loading.allMeasures = false;
                state.error.allMeasures = action.payload || { message: "Failed to fetch all performance measures" };
            });
        
        // Create measure
        builder.addCase(createPerformanceMeasure.pending, (state) => {
            state.loading.create = true;
            state.error.create = null;
        });
        builder.addCase(createPerformanceMeasure.fulfilled, (state, action) => {
            state.loading.create = false;
            // Optimistic update - add to first page if on first page
            if (state.measures.pagination.currentPage === 1) {
                state.measures.data = [action.payload, ...state.measures.data.slice(0, -1)];
            }
        });
        builder.addCase(createPerformanceMeasure.rejected, (state, action) => {
            state.loading.create = false;
            state.error.create = action.payload || { message: 'Failed to create performance measure' };
        });
        
        // Update measure
        builder.addCase(updatePerformanceMeasure.pending, (state) => {
            state.loading.update = true;
            state.error.update = null;
        });
        builder.addCase(updatePerformanceMeasure.fulfilled, (state, action) => {
            state.loading.update = false;
            const index = state.measures.data.findIndex(m => m.id === action.payload.id);
            if (index !== -1) {
                state.measures.data[index] = action.payload;
            }
        });
        builder.addCase(updatePerformanceMeasure.rejected, (state, action) => {
            state.loading.update = false;
            state.error.update = action.payload || { message: 'Failed to update performance measure' };
        });
        
        // Delete measure
        builder.addCase(deletePerformanceMeasure.pending, (state) => {
            state.loading.delete = true;
            state.error.delete = null;
        });
        builder.addCase(deletePerformanceMeasure.fulfilled, (state, action) => {
            state.loading.delete = false;
            state.measures.data = state.measures.data.filter(m => m.id !== action.payload);
        });
        builder.addCase(deletePerformanceMeasure.rejected, (state, action) => {
            state.loading.delete = false;
            state.error.delete = action.payload || { message: 'Failed to delete performance measure' };
        });
    }
});

export const { resetErrors, setCurrentPage } = performanceMeasureSlice.actions;

export default performanceMeasureSlice.reducer;