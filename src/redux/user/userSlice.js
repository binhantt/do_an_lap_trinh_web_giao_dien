import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUsersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
      console.log(state.users);
    },
    fetchUsersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUserByIdSuccess(state, action) {
      state.loading = false;
      state.selectedUser = action.payload;
    },
    createUserSuccess(state, action) {
      state.users.push(action.payload);
    },
    updateUserSuccess(state, action) {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.selectedUser && state.selectedUser.id === action.payload.id) {
        state.selectedUser = action.payload;
      }
      // Dispatch fetchUsers to refresh the user list
      fetchUsersStart(state);
    },
    deleteUserSuccess(state, action) {
      state.users = state.users.filter(user => user.id !== action.payload);
      if (state.selectedUser && state.selectedUser.id === action.payload) {
        state.selectedUser = null;
      }
    }
  }
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserByIdSuccess,
  createUserSuccess,
  updateUserSuccess,
  deleteUserSuccess
} = userSlice.actions;

export default userSlice.reducer;