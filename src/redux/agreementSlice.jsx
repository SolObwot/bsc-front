import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { agreementService } from "../services/agreement.service";
import { handleApiError } from "../services/apiHandler";

export const fetchAgreements = createAsyncThunk(
  "agreements/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      // If a direct URL is provided, use it instead of building params
      if (params && params.url) {
        return await agreementService.getAgreementsFromUrl(params.url);
      }

      // Otherwise use the standard approach with params
      return await agreementService.getAgreements(params);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllAgreements = createAsyncThunk(
  "agreements/fetchAllPaginated",
  async (params, { rejectWithValue }) => {
    try {
      // Fetch the first page to get pagination metadata
      const firstPageResponse = await agreementService.getAgreements({
        ...params,
        page: 1,
      });
      const totalPages = firstPageResponse.last_page;
      let allAgreements = firstPageResponse.data;

      // If there is more than one page, fetch the rest
      if (totalPages > 1) {
        const pagePromises = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(
            agreementService.getAgreements({ ...params, page })
          );
        }
        // Fetch all remaining pages concurrently
        const subsequentPageResponses = await Promise.all(pagePromises);
        const subsequentAgreements = subsequentPageResponses.flatMap(
          (response) => response.data
        );
        allAgreements = [...allAgreements, ...subsequentAgreements];
      }

      // Return the complete, aggregated list of agreements
      return allAgreements;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const initializeWithUserDepartment = createAsyncThunk(
  "agreements/initializeWithUserDepartment",
  async (params, { dispatch, rejectWithValue }) => {
    // Accept params
    try {
      // Step 1: Fetch user's own agreements to get department_id
      const myAgreementsResponse = await agreementService.getAgreements({
        my_agreements: true,
      });

      // Step 2: Extract department_id from the first agreement (if any)
      let departmentId = null;

      if (myAgreementsResponse?.data && myAgreementsResponse.data.length > 0) {
        const agreementWithDept = myAgreementsResponse.data.find(
          (agreement) => agreement.department_id
        );
        if (agreementWithDept) {
          departmentId = agreementWithDept.department_id.toString();
        }
      }

      // Step 3: Check if we're in the AgreementList context (preserve my_agreements)
      if (params && params.my_agreements) {
        // Just return the agreements we already fetched instead of fetching all department agreements
        return { departmentId, agreements: myAgreementsResponse.data };
      }

      // Otherwise, proceed with department-wide fetch (for other views)
      if (departmentId) {
        await dispatch(
          fetchAllAgreements({ ...params, department_id: departmentId })
        );
      } else {
        await dispatch(fetchAllAgreements(params));
      }

      return { departmentId };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMyAgreements = createAsyncThunk(
  "agreements/fetchMyAgreements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await agreementService.getAgreements({
        my_agreements: true,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAgreement = createAsyncThunk(
  "agreements/fetchOne",
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
  "agreements/create",
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
  "agreements/update",
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
  "agreements/delete",
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
  "agreements/submit",
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
  "agreements/supervisorApprove",
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
  "agreements/hodApprove",
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
  name: "agreements",
  initialState: {
    myAgreements: [], // For the user's own agreements
    departmentAgreements: [], // For department-level views (HOD, Review)
    agreements: [], // Kept for backward compatibility
    pagination: {
      currentPage: 1,
      totalPages: 1,
      perPage: 20,
      total: 0,
    },
    userDepartmentId: null,
    currentAgreement: null,
    loading: false,
    error: null,
  },
  reducers: {
    deleteAgreementFromState: (state, action) => {
      // Update both lists to be safe
      state.myAgreements = state.myAgreements.filter(
        (agreement) => agreement.id !== action.payload
      );
      state.departmentAgreements = state.departmentAgreements.filter(
        (agreement) => agreement.id !== action.payload
      );
      // For backward compatibility
      state.agreements = state.agreements.filter(
        (agreement) => agreement.id !== action.payload
      );
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
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
          state.departmentAgreements = action.payload.data;
          // For backward compatibility
          state.agreements = action.payload.data;

          state.pagination = {
            currentPage: action.payload.current_page,
            totalPages: action.payload.last_page,
            perPage: action.payload.per_page,
            total: action.payload.total,
          };
        } else {
          state.departmentAgreements = [];
          // For backward compatibility
          state.agreements = [];

          state.pagination = {
            currentPage: 1,
            totalPages: 1,
            perPage: 20,
            total: 0,
          };
        }
      })
      .addCase(fetchAgreements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch agreements";
        handleApiError(action.payload);
      })

      // --- ADD HANDLER FOR THE NEW THUNK ---
      .addCase(fetchAllAgreements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAgreements.fulfilled, (state, action) => {
        state.loading = false;
        // The payload is the full list of agreements
        state.departmentAgreements = action.payload;
        // For backward compatibility
        state.agreements = action.payload;

        // Reset pagination as we now have all data client-side
        state.pagination = {
          currentPage: 1,
          totalPages: 1,
          perPage: action.payload.length,
          total: action.payload.length,
        };
      })
      .addCase(fetchAllAgreements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all agreements";
        handleApiError(action.payload);
      })

      // Handle the department detection thunk
      .addCase(initializeWithUserDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeWithUserDepartment.fulfilled, (state, action) => {
        // Store the detected department ID
        state.userDepartmentId = action.payload.departmentId;

        // If we have agreements in the payload, use those (for my_agreements case)
        if (action.payload.agreements) {
          state.myAgreements = action.payload.agreements;
          // For backward compatibility
          state.agreements = action.payload.agreements;

          state.pagination = {
            currentPage: 1,
            totalPages: 1,
            perPage: action.payload.agreements.length,
            total: action.payload.agreements.length,
          };
          state.loading = false;
        }
        // Otherwise, fetchAllAgreements will handle setting the state
      })
      .addCase(initializeWithUserDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to initialize agreements";
        handleApiError(action.payload);
      })

      // Fetch my agreements
      .addCase(fetchMyAgreements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAgreements.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload && action.payload.data) {
          state.myAgreements = action.payload.data;
          // For backward compatibility
          state.agreements = action.payload.data;

          state.pagination = {
            currentPage: action.payload.current_page,
            totalPages: action.payload.last_page,
            perPage: action.payload.per_page,
            total: action.payload.total,
          };
        } else {
          state.myAgreements = [];
          // For backward compatibility
          state.agreements = [];

          state.pagination = {
            currentPage: 1,
            totalPages: 1,
            perPage: 20,
            total: 0,
          };
        }
      })
      .addCase(fetchMyAgreements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch my agreements";
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
      .addCase(updateAgreement.fulfilled, (state, action) => {
        state.loading = false;

        // Get the complete agreement from the API response
        const updatedAgreement = action.payload?.data;

        if (updatedAgreement) {
          // Update myAgreements list
          const myIndex = state.myAgreements.findIndex(
            (a) => a.id === updatedAgreement.id
          );
          if (myIndex !== -1) {
            state.myAgreements[myIndex] = updatedAgreement;
          }

          // Update departmentAgreements list
          const depIndex = state.departmentAgreements.findIndex(
            (a) => a.id === updatedAgreement.id
          );
          if (depIndex !== -1) {
            state.departmentAgreements[depIndex] = updatedAgreement;
          }

          // For backward compatibility
          const index = state.agreements.findIndex(
            (a) => a.id === updatedAgreement.id
          );
          if (index !== -1) {
            state.agreements[index] = updatedAgreement;
          }

          // Also update currentAgreement if it's the same one
          if (state.currentAgreement?.id === updatedAgreement.id) {
            state.currentAgreement = updatedAgreement;
          }
        }

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

        // Update the agreement in the state
        const index = state.agreements.findIndex(
          (a) => a.id === updatedAgreement.id
        );
        if (index !== -1) {
          state.agreements[index] = updatedAgreement;
        }

        // Also update currentAgreement if it's the same one
        if (state.currentAgreement?.id === updatedAgreement.id) {
          state.currentAgreement = updatedAgreement;
        }
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
        const updatedAgreement = action.payload.agreement;

        if (updatedAgreement && updatedAgreement.id) {
          const updateAgreementInList = (list) =>
            list.map((agreement) => {
              if (agreement.id === updatedAgreement.id) {
                // Merge existing agreement with the update to preserve nested objects
                return { ...agreement, ...updatedAgreement };
              }
              return agreement;
            });

          state.departmentAgreements = updateAgreementInList(
            state.departmentAgreements
          );
          state.agreements = updateAgreementInList(state.agreements);
        }
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
        const updatedAgreement = action.payload.agreement;
        if (updatedAgreement && updatedAgreement.id) {
          const updateAgreementInList = (list) =>
            list.map((agreement) => {
              if (agreement.id === updatedAgreement.id) {
                // Merge existing agreement with the update to preserve nested objects
                return { ...agreement, ...updatedAgreement };
              }
              return agreement;
            });

          state.departmentAgreements = updateAgreementInList(
            state.departmentAgreements
          );
          state.agreements = updateAgreementInList(state.agreements);
        }
      })
      .addCase(hodApproveAgreement.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        handleApiError(action.payload);
      });
  },
});

export const { deleteAgreementFromState, setCurrentPage } =
  agreementSlice.actions;
export default agreementSlice.reducer;
