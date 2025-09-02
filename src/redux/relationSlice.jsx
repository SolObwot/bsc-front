import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { relationService } from "../services/relation.service";

export const fetchRelations = createAsyncThunk("relations/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await relationService.getRelations();
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const fetchRelation = createAsyncThunk("relations/fetchOne", async (id, { rejectWithValue }) => {
    try {
        const response = await relationService.getRelation(id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const createRelation = createAsyncThunk("relations/create", async (formData, { rejectWithValue }) => {
    try {
        const response = await relationService.createRelation(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateRelation = createAsyncThunk("relations/update", async ({ id, formData }, { rejectWithValue }) => {
    try {
        const response = await relationService.updateRelation(id, formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteRelation = createAsyncThunk("relations/delete", async (id, { rejectWithValue }) => {
    try {
        await relationService.deleteRelation(id);
        return id;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const relationSlice = createSlice({
    name: "relations",
    initialState: {
        currentRelation: null,
        allRelations: [],
        loading: false,
        error: null,
    },
    reducers: {
        deleteRelationFromState: (state, action) => {
            state.allRelations = state.allRelations.filter((relation) => relation.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRelations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRelations.fulfilled, (state, action) => {
                state.allRelations = action.payload;
                state.loading = false;
            })
            .addCase(fetchRelations.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(fetchRelation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRelation.fulfilled, (state, action) => {
                state.currentRelation = action.payload;
                state.loading = false;
            })
            .addCase(fetchRelation.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(createRelation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRelation.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createRelation.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(updateRelation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRelation.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateRelation.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(deleteRelation.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRelation.fulfilled, (state, action) => {
                state.allRelations = state.allRelations.filter((relation) => relation.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteRelation.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export const { deleteRelationFromState } = relationSlice.actions;
export default relationSlice.reducer;
