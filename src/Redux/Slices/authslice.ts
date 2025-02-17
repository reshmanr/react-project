import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userId: string;
  username: string;
  email: string ;
  likedpost:[];
  bookmarkedpost:[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: '',
  username: '',
  email: '',
  likedpost:[],
  bookmarkedpost:[]
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ userId: string; username: string; email: string }>) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.userId = '';
      state.username = '';
      state.email = '';
    }
  }
})

export const { signIn, signOut } = authSlice.actions
export default authSlice.reducer
