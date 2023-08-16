import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadCities = createAsyncThunk(
  'admin/loadCities',
  async (inputValue, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/city/?provinceId=&page=1&searchName=${inputValue}`);
      return response.data.cities.map(city => ({
        value: city.id,
        label: city.name,
      }));
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const loadWarehouses = createAsyncThunk(
  'admin/loadWarehouses',
  async ({ inputValue, selectedCity }, { rejectWithValue }) => {
    if (!selectedCity || !inputValue) return [];
    const endpoint = `http://localhost:8000/api/warehouse/warehouse-list`;
    const queryParameters = `searchName=${inputValue}&cityId=${selectedCity.value}`;
    try {
      const response = await axios.get(`${endpoint}?${queryParameters}`);
      if (!response.data || !Array.isArray(response.data.warehouses)) {
        throw new Error('Unexpected API response format.');
      }
      return response.data.warehouses.map(({ id, warehouse_name }) => ({
        value: id,
        label: warehouse_name,
      }));
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const refreshAdminList = createAsyncThunk(
  'admin/refreshAdminList',
  async ({ selectedCity, selectedWarehouse, adminName, newPage }, { rejectWithValue }) => {
    try {
      if (!selectedCity || !selectedWarehouse) throw new Error('Required data is missing.');
      const url = `http://localhost:8000/api/admin/?searchName=${adminName}&warehouseId=${selectedWarehouse.value}&page=${newPage}`;
      const response = await axios.get(url);
      return {
        admins: response.data.admins,
        pagination: {
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
        },
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  cities: [],
  warehouses: [],
  admins: [],
  selectedCity: null,
  selectedWarehouse: null,
  adminName: "",
  isLoading: false,
  error: null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setCities: (state, action) => {
      state.cities = action.payload;
    },
    setWarehouses: (state, action) => {
      state.warehouses = action.payload;
    },
    setAdmins: (state, action) => {
      state.admins = action.payload.admins;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    setSelectedWarehouse: (state, action) => {
      state.selectedWarehouse = action.payload;
    },
    setAdminName: (state, action) => {
      state.adminName = action.payload;
    },
    resetAdminState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCities.fulfilled, (state, action) => {
        state.cities = action.payload;
        state.isLoading = false;
      })
      .addCase(loadCities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loadWarehouses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadWarehouses.fulfilled, (state, action) => {
        state.warehouses = action.payload;
        state.isLoading = false;
      })
      .addCase(loadWarehouses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshAdminList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAdminList.fulfilled, (state, action) => {
        state.admins = action.payload.admins;
        state.pagination = action.payload.pagination;
        state.isLoading = false;
      })
      .addCase(refreshAdminList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCities,
  setWarehouses,
  setAdmins,
  setSelectedCity,
  setSelectedWarehouse,
  setAdminName,
  resetAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;

