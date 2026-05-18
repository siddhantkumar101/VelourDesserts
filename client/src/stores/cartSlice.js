import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(
        (i) => i.productId === item.productId && i.variantLabel === item.variantLabel
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) => !(i.productId === action.payload.productId && i.variantLabel === action.payload.variantLabel)
      );
    },
    updateQuantity: (state, action) => {
      const { productId, variantLabel, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId && i.variantLabel === variantLabel);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
