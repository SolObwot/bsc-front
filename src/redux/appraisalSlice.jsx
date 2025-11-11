import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { appraisalService } from "../services/appraisal.service";
import { handleApiError } from "../services/apiHandler";

export const fetchAppraisals = createAsyncThunk(
  "appraisals/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      if (params?.url) {
        return await appraisalService.getAppraisalsFromUrl(params.url);
      }
      return await appraisalService.getAppraisals(params);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllAppraisals = createAsyncThunk(
  "appraisals/fetchAllPaginated",
  async (params, { rejectWithValue }) => {
    try {
      const firstPageResponse = await appraisalService.getAppraisals({
        ...params,
        page: 1,
      });
      const totalPages = firstPageResponse.last_page;
      let allAppraisals = firstPageResponse.data;

      if (totalPages > 1) {
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(
            appraisalService.getAppraisals({ ...params, page })
          );
        }
        const subsequentPageResponses = await Promise.all(pagePromises);
        const subsequentAppraisals = subsequentPageResponses.flatMap(
          (response) => response.data
        );
        allAppraisals = [...allAppraisals, ...subsequentAppraisals];
      }

      return allAppraisals;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const initializeAppraisalsWithUserDepartment = createAsyncThunk(
  "appraisals/initializeWithUserDepartment",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const myAppraisalsResponse = await appraisalService.getAppraisals({
        my_appraisals: true,
      });

      let departmentId = null;

      if (myAppraisalsResponse?.data?.length) {
        const appraisalWithDept = myAppraisalsResponse.data.find(
          (appraisal) => appraisal.department_id
        );
        if (appraisalWithDept) {
          departmentId = appraisalWithDept.department_id.toString();
        }
      }

      if (params?.my_appraisals) {
        return { departmentId, appraisals: myAppraisalsResponse.data };
      }

      if (departmentId) {
        await dispatch(
          fetchAllAppraisals({ ...params, department_id: departmentId })
        );
      } else {
        await dispatch(fetchAllAppraisals(params));
      }

      return { departmentId };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMyAppraisals = createAsyncThunk(
  "appraisals/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      return await appraisalService.getAppraisals({
        my_appraisals: true,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAppraisal = createAsyncThunk(
  "appraisals/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await appraisalService.getAppraisal(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createAppraisal = createAsyncThunk(
  "appraisals/create",
  async (formData, { rejectWithValue }) => {
    try {
      return await appraisalService.createAppraisal(formData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateAppraisal = createAsyncThunk(
  "appraisals/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await appraisalService.updateAppraisal(id, formData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAppraisal = createAsyncThunk(
  "appraisals/delete",
  async (id, { rejectWithValue }) => {
    try {
      await appraisalService.deleteAppraisal(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const submitAppraisal = createAsyncThunk(
  "appraisals/submit",
  async (id, { rejectWithValue }) => {
    try {
      return await appraisalService.submitAppraisal(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const appraisalSlice = createSlice({
  name: "appraisals",
  initialState: {
    myAppraisals: [],
    departmentAppraisals: [],
    appraisals: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      perPage: 20,
      total: 0,
    },
    userDepartmentId: null,
    currentAppraisal: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetMyAppraisals: (state) => {
      state.myAppraisals = [];
      state.appraisals = [];
      state.error = null;
    },
    deleteAppraisalFromState: (state, action) => {
      state.myAppraisals = state.myAppraisals.filter(
        (appraisal) => appraisal.id !== action.payload
      );
      state.departmentAppraisals = state.departmentAppraisals.filter(
        (appraisal) => appraisal.id !== action.payload
      );
      state.appraisals = state.appraisals.filter(
        (appraisal) => appraisal.id !== action.payload
      );
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppraisals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppraisals.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.data) {
          state.departmentAppraisals = action.payload.data;
          state.appraisals = action.payload.data;
          state.pagination = {
            currentPage: action.payload.current_page,
            totalPages: action.payload.last_page,
            perPage: action.payload.per_page,
            total: action.payload.total,
          };
        } else {
          state.departmentAppraisals = [];
          state.appraisals = [];
          state.pagination = {
            currentPage: 1,
            totalPages: 1,
            perPage: 20,
            total: 0,
          };
        }
      })
      .addCase(fetchAppraisals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch appraisals";
        handleApiError(action.payload);
      })
      .addCase(fetchAllAppraisals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppraisals.fulfilled, (state, action) => {
        state.loading = false;
        state.departmentAppraisals = action.payload;
        state.appraisals = action.payload;
        state.pagination = {
          currentPage: 1,
          totalPages: 1,
          perPage: action.payload.length,
          total: action.payload.length,
        };
      })
      .addCase(fetchAllAppraisals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all appraisals";
        handleApiError(action.payload);
      })
      .addCase(initializeAppraisalsWithUserDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        initializeAppraisalsWithUserDepartment.fulfilled,
        (state, action) => {
          state.userDepartmentId = action.payload.departmentId;
          if (action.payload.appraisals) {
            state.myAppraisals = action.payload.appraisals;
            state.appraisals = action.payload.appraisals;
            state.pagination = {
              currentPage: 1,
              totalPages: 1,
              perPage: action.payload.appraisals.length,
              total: action.payload.appraisals.length,
            };
            state.loading = false;
          }
        }
      )
      .addCase(
        initializeAppraisalsWithUserDepartment.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error.message || "Failed to initialize appraisals";
          handleApiError(action.payload);
        }
      )
      .addCase(fetchMyAppraisals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAppraisals.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.data) {
          state.myAppraisals = action.payload.data;
          state.appraisals = action.payload.data;
          state.pagination = {
            currentPage: action.payload.current_page,
            totalPages: action.payload.last_page,
            perPage: action.payload.per_page,
            total: action.payload.total,
          };
        } else {
          state.myAppraisals = [];
          state.appraisals = [];
          state.pagination = {
            currentPage: 1,
            totalPages: 1,
            perPage: 20,
            total: 0,
          };
        }
      })
      .addCase(fetchMyAppraisals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch my appraisals";
        handleApiError(action.payload);
      })
      .addCase(fetchAppraisal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppraisal.fulfilled, (state, action) => {
        state.currentAppraisal = action.payload;
        state.loading = false;
      })
      .addCase(fetchAppraisal.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(createAppraisal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppraisal.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAppraisal.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(updateAppraisal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppraisal.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAppraisal = action.payload?.data;

        if (updatedAppraisal) {
          const updateList = (list) =>
            list.map((appraisal) =>
              appraisal.id === updatedAppraisal.id
                ? updatedAppraisal
                : appraisal
            );

          state.myAppraisals = updateList(state.myAppraisals);
          state.departmentAppraisals = updateList(state.departmentAppraisals);
          state.appraisals = updateList(state.appraisals);

          if (state.currentAppraisal?.id === updatedAppraisal.id) {
            state.currentAppraisal = updatedAppraisal;
          }
        }

        state.error = null;
      })
      .addCase(updateAppraisal.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(deleteAppraisal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppraisal.fulfilled, (state, action) => {
        state.loading = false;
        state.myAppraisals = state.myAppraisals.filter(
          (appraisal) => appraisal.id !== action.payload
        );
        state.departmentAppraisals = state.departmentAppraisals.filter(
          (appraisal) => appraisal.id !== action.payload
        );
        state.appraisals = state.appraisals.filter(
          (appraisal) => appraisal.id !== action.payload
        );
      })
      .addCase(deleteAppraisal.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      })
      .addCase(submitAppraisal.fulfilled, (state, action) => {
        state.loading = false;
        let updatedAppraisal;

        if (action.payload?.data) {
          updatedAppraisal = action.payload.data;
        } else if (action.payload?.id) {
          updatedAppraisal = action.payload;
        } else {
          return;
        }

        const updateList = (list) =>
          list.map((appraisal) =>
            appraisal.id === updatedAppraisal.id ? updatedAppraisal : appraisal
          );

        state.appraisals = updateList(state.appraisals);
        state.departmentAppraisals = updateList(state.departmentAppraisals);
        state.myAppraisals = updateList(state.myAppraisals);

        if (state.currentAppraisal?.id === updatedAppraisal.id) {
          state.currentAppraisal = updatedAppraisal;
        }
      })
      .addCase(submitAppraisal.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      });
  },
});

export const { resetMyAppraisals, deleteAppraisalFromState, setCurrentPage } =
  appraisalSlice.actions;

export default appraisalSlice.reducer;
