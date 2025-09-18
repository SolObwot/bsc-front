import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../services/user.service";

// Async thunks for CRUD operations
export const fetchUsers = createAsyncThunk(
    "users/fetchAll",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await userService.getUsers(params);
            
            const transformedData = {
                ...response.data,
                data: response.data.data.map(user => {
                    // Extract employment details (handling both array and object formats)
                    const employmentDetails = Array.isArray(user.employment_details)
                        ? user.employment_details[0] || {}
                        : user.employment_details || {};
                    
                    return {
                        ...user,
                        department: user.unit_or_branch?.department?.name || null,
                        unit: user.unit_or_branch?.name || null,
                        fullDepartment: user.unit_or_branch?.department?.name || 'N/A',
                        fullUnit: user.unit_or_branch?.name || 'N/A',
                        jobTitle: user.job_title?.name || null,
                        employmentCategory: employmentDetails.employment_category,
                        isProbation: employmentDetails.is_probation === 1,
                    };
                })
            };
            
            return transformedData;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch users';
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchUser = createAsyncThunk(
    "users/fetchOne",
    async (id, { rejectWithValue }) => {
        try {
            const response = await userService.getUser(id);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user';
            return rejectWithValue(errorMessage);
        }
    }
);

export const createUser = createAsyncThunk(
    "users/create",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await userService.createUser(formData);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create user';
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/update",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await userService.updateUser(id, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    "users/delete",
    async (id, { rejectWithValue }) => {
        try {
            await userService.deleteUser(id);
            return id;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user';
            return rejectWithValue(errorMessage);
        }
    }
);

export const toggleUserLock = createAsyncThunk(
    "users/toggleLock",
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            let response;
            // Call the appropriate endpoint based on current status
            if (isActive) {
                // If user is active, lock them
                response = await userService.lockUser(id);
            } else {
                // If user is inactive, unlock them
                response = await userService.unlockUser(id);
            }
            return { id, is_active: response.is_active };
        } catch (error) {
            // Serialize the error to prevent non-serializable values in Redux state
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
            return rejectWithValue(errorMessage);
        }
    }
);

const userSlice = createSlice({
    name: "users",
    initialState: {
        currentUser: null,
        allUsers: [],
        loading: false,
        error: null,
    },
    reducers: {
        deleteUserFromState: (state, action) => {
            state.allUsers = state.allUsers.filter(
                (item) => item.id !== action.payload
            );
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload.data || [];
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.currentUser = action.payload.data;
                state.loading = false;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.allUsers = state.allUsers.filter(
                    (item) => item.id !== action.payload
                );
                state.loading = false;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(toggleUserLock.pending, (state) => {
                state.loading = true;
            })
            .addCase(toggleUserLock.fulfilled, (state, action) => {
                const { id, is_active } = action.payload;
                const user = state.allUsers.find(user => user.id === id);
                if (user) {
                    user.is_active = is_active;
                }
                state.loading = false;
            })
            .addCase(toggleUserLock.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export const { deleteUserFromState, clearError } = userSlice.actions;
export default userSlice.reducer;