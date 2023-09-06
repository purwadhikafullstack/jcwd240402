import { createSlice } from '@reduxjs/toolkit';

export const warehouseListSlice = createSlice({
  name: 'warehouse',
  initialState: {
    warehouseModalVisible: false,
    warehouseProfileModalVisible: false,
    warehouseEditModalVisible: false,
    modalSelectedWarehouse: null,
  },
  reducers: {
    openWarehouseModal: (state, action) => {
      state.warehouseModalVisible = true;
      state.modalSelectedWarehouse = action.payload;
    },
    closeWarehouseModal: (state) => {
      state.warehouseModalVisible = false;
      state.modalSelectedWarehouse = null;
    },
    openWarehouseProfileModal: (state, action) => {
      state.warehouseProfileModalVisible = true;
      state.modalSelectedWarehouse = action.payload;
    },
    closeWarehouseProfileModal: (state) => {
      state.warehouseProfileModalVisible = false;
      state.modalSelectedWarehouse = null;
    },
    openWarehouseEditModal: (state, action) => {
      state.warehouseEditModalVisible = true;
      state.modalSelectedWarehouse = action.payload;
    },
    closeWarehouseEditModal: (state) => {
      state.warehouseEditModalVisible = false;
      state.modalSelectedWarehouse = null;
    },
  },
});

export const {
  openWarehouseModal,
  closeWarehouseModal,
  openWarehouseProfileModal,
  closeWarehouseProfileModal,
  openWarehouseEditModal,
  closeWarehouseEditModal,
} = warehouseListSlice.actions;

export const selectWarehouseModalVisible = (state) => state.warehouse.warehouseModalVisible;
export const selectWarehouseProfileModalVisible = (state) => state.warehouse.warehouseProfileModalVisible;
export const selectWarehouseEditModalVisible = (state) => state.warehouse.warehouseEditModalVisible;
export const selectModalSelectedWarehouse = (state) => state.warehouse.modalSelectedWarehouse;

export default warehouseListSlice.reducer;
