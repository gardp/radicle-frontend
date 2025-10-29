import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi } from '../../api';

// Initial state
const initialState = {
  orderedItems: [],
  currentOrder: [],
  orderHistory: [],
  isSubmitting: false,
  submitSuccess: false,
  error: null,
};

// Async thunk for submitting order to the backend
export const submitOrderThunk = createAsyncThunk(
  'order/submit',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderApi.submitOrder(orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to submit order:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit order'
      );
    }
  }
);

// Get order by ID thunk
export const getOrderThunk = createAsyncThunk(
  'order/getById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrder(orderId);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order'
      );
    }
  }
);

// Get user order history thunk
export const getUserOrdersThunk = createAsyncThunk(
  'order/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getUserOrders();
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order history:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order history'
      );
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Reset order state (for after navigation away from checkout)
    resetOrderState: (state) => {
      state.currentOrder = null;
      state.isSubmitting = false;
      state.submitSuccess = false;
      state.error = null;
    },
    // Set current order locally (before submission)
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit order cases
      .addCase(submitOrderThunk.pending, (state) => {
        state.isSubmitting = true;
        state.submitSuccess = false;
        state.error = null;
      })
      .addCase(submitOrderThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submitSuccess = true;
        state.currentOrder = action.payload;
      })
      .addCase(submitOrderThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitSuccess = false;
        state.error = action.payload;
      })
      // Get order cases
      .addCase(getOrderThunk.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      // Get user orders cases
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.orderHistory = action.payload;
      });
  },
});

// Export actions
export const { resetOrderState, setCurrentOrder } = orderSlice.actions;

// Export selectors
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderHistory = (state) => state.order.orderHistory;
export const selectIsSubmitting = (state) => state.order.isSubmitting;
export const selectSubmitSuccess = (state) => state.order.submitSuccess;
export const selectOrderError = (state) => state.order.error;

// Export reducer
export default orderSlice.reducer;
