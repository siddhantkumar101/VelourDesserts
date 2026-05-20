import { createSlice } from '@reduxjs/toolkit';

const loadAuthFromStorage = () => {
  try {
    const serializedAuth = localStorage.getItem('velour_auth');
    if (serializedAuth) {
      return JSON.parse(serializedAuth);
    }
  } catch (err) {
    console.error("Could not load auth state", err);
  }
  return {
    user: null,
    accessToken: null,
    isAuthenticated: false,
  };
};

const initialState = loadAuthFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('velour_auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('velour_auth');
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('velour_auth', JSON.stringify(state));
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
