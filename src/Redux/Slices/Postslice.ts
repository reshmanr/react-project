import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Comment = {
  user: string;
  content: string;
};

type PostState = {
  id: string;
  title: string;
  content: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  comments: Comment[];
};

const initialState: PostState = {
  id: '',
  title: '',
  content: '',
  likes: 0,
  isLiked: false,
  isBookmarked: false,
  comments: []
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<PostState>) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.likes = action.payload.likes;
      state.isLiked = action.payload.isLiked;
      state.isBookmarked = action.payload.isBookmarked;
      state.comments = action.payload.comments;
    },
    likePost: (state) => {
      state.isLiked = true;
      state.likes += 1;
    },
    unlikePost: (state) => {
      state.isLiked = false;
      state.likes -= 1;
    },
    bookmarkPost: (state) => {
      state.isBookmarked = true;
    },
    unbookmarkPost: (state) => {
      state.isBookmarked = false;
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    }
  }
});

export const { setPost, likePost, unlikePost, bookmarkPost, unbookmarkPost, addComment } = postSlice.actions;
export default postSlice.reducer;
