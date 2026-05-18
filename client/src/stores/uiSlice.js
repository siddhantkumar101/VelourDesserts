import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCartOpen: false,
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
    addToast: (state, action) => {
      state.toasts.push({
        id: Date.now().toString(),
        type: action.payload.type || 'info', // success, error, info, warning
        message: action.payload.message,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { toggleCart, setCartOpen, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
