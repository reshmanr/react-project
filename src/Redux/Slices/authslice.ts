import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Post {
  id: string;
  title: string;
  image: string;
  content: string;
  likes: number;
  bookmarks: number;
  comments: string[];
  category: string;
}

interface AuthState {
  isAuthenticated: boolean;
  userId: string;
  username: string;
  email: string ;
  likedposts:Post[];
  bookmarkedposts:Post[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: '',
  username: '',
  email: '',
  likedposts:[],
  bookmarkedposts:[]
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ userId: string; username: string; email: string;likedposts?: Post[];
      bookmarkedposts?: Post[]; }>) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.likedposts = action.payload.likedposts || [];
      state.bookmarkedposts = action.payload.bookmarkedposts || [];
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.userId = '';
      state.username = '';
      state.email = '';
      state.likedposts = [];
      state.bookmarkedposts = [];
    },
    addLikedPost: (state, action: PayloadAction<Post>) => {
      
      if (!state.likedposts.find(post => post.id === action.payload.id)) {
        state.likedposts.push(action.payload);
      }
    },
    removeLikedPost: (state, action: PayloadAction<string>) => {
      
      state.likedposts = state.likedposts.filter(post => post.id !== action.payload);
    },
    addBookmarkedPost: (state, action: PayloadAction<Post>) => {
      if (!state.bookmarkedposts.find(post => post.id === action.payload.id)) {
        state.bookmarkedposts.push(action.payload);
      }
    },
    removeBookmarkedPost: (state, action: PayloadAction<string>) => {
      state.bookmarkedposts = state.bookmarkedposts.filter(post => post.id !== action.payload);
    },
  }
})

export const { signIn, signOut,addLikedPost,
  removeLikedPost,
  addBookmarkedPost,
  removeBookmarkedPost } = authSlice.actions
export default authSlice.reducer
