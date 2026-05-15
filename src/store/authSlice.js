import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    user: {tenant_id: null}
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, tenantId } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      state.user.tenant_id = tenantId;
      localStorage.setItem('token', token);
    },
    logOut: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;