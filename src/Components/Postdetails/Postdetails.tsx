import { useParams, useNavigate ,Link} from 'react-router-dom';
import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../Service/api';
import { useDispatch, useSelector } from 'react-redux';
import {
  addLikedPost,
  removeLikedPost,
  addBookmarkedPost,
  removeBookmarkedPost,
  signIn
} from '../../Redux/Slices/authslice';
import Post from '../../Redux/Slices/authslice'
import { useState } from 'react';

interface Post {
  id: string;
  title: string;
  image: string;
  content: string;
  likes: number;
  bookmarks: number;
  comments: string[];
  category: string;
}

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");

  const { isAuthenticated, likedposts, bookmarkedposts,userId } = useSelector((state: any) => state.auth);

  console.log("isAuthenticated:", isAuthenticated);
 
  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await api.get(`/blogwebsite/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const isLiked = likedposts.some((p: Post) => p.id === post?.id);
  const isBookmarked = bookmarkedposts.some((p: Post) => p.id === post?.id);


  const likeMutation = useMutation<Post, Error, number>({
    mutationFn: async (increment: number) => {
      if (!post) {
        console.error("ERROR: Post not loaded!");
        throw new Error("Post not loaded"); 
      }
      
      const updatedPost: Post = { ...post, likes: post.likes + increment };
      await api.put(`/blogwebsite/${post.id}`, updatedPost);

      const { data: user } = await api.get(`/users/${userId}`);
      console.log(" User Data Before Update:", user);

      
      const userLikedPosts: any[] = Array.isArray(user.likedpost) ? user.likedpost : [];
      console.log("User Liked Posts Before Update:", userLikedPosts);
    
 
    const updatedLikes = userLikedPosts.some((p: any) => p.id === post.id)
    ? userLikedPosts.filter((p: any) => p.id !== post.id)
    : [...userLikedPosts, { id: post.id, title: post.title, image: post.image }]; 

      console.log("Updated Likes Array (Before API Call):", updatedLikes);
 

console.log(" Updated Likes Array (Before API Call):", updatedLikes);
         


        await api.put(`/users/${userId}`, {
          ...user,
          likedpost: [...updatedLikes]
        });
      
    console.log("API Request Successfully Sent:", `/users/${userId}`, { likedpost: updatedLikes });

      return updatedPost
    },


    onSuccess: async (_: Post) => {
    
      queryClient.invalidateQueries({ queryKey: ['post', id as string] });
   
      const { data: updatedUser } = await api.get(`/users/${userId}`);
      dispatch(
        signIn({
          userId: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          likedposts: updatedUser.likedpost,     
          bookmarkedposts: updatedUser.bookmarkedpost,
        })
      );
    },
  });

  const bookmarkMutation = useMutation<Post, Error, number>({
    mutationFn: async (increment: number) => {
      if (!post) {
        console.error("ERROR: Post not loaded!");
        throw new Error("Post not loaded");
      }
      
    
      const updatedPost: Post = { ...post, bookmarks: post.bookmarks + increment };
      await api.put(`/blogwebsite/${post.id}`, updatedPost);
      
    
      const { data: user } = await api.get(`/users/${userId}`);
      console.log("User Data Before Update (Bookmark):", user);
      
   
      const userBookmarkedPosts: any[] = Array.isArray(user.bookmarkedpost) ? user.bookmarkedpost : [];
      console.log("User Bookmarked Posts Before Update:", userBookmarkedPosts);
    
      const updatedBookmarks = userBookmarkedPosts.some((p: any) => p.id === post.id)
        ? userBookmarkedPosts.filter((p: any) => p.id !== post.id)
        : [...userBookmarkedPosts, { id: post.id, title: post.title, image: post.image }];
      
      console.log("Updated Bookmarks Array (Before API Call):", updatedBookmarks);
      

      await api.put(`/users/${userId}`, {
        ...user,
        bookmarkedpost: [...updatedBookmarks]
      });
      
      console.log("API Request Successfully Sent (Bookmark):", `/users/${userId}`, { bookmarkedpost: updatedBookmarks });
      
      return updatedPost;
    },
    onSuccess: async (_: Post) => {
      queryClient.invalidateQueries({ queryKey: ['post', id as string] });
      const { data: updatedUser } = await api.get(`/users/${userId}`);
      dispatch(
        signIn({
          userId: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          likedposts: updatedUser.likedpost,
          bookmarkedposts: updatedUser.bookmarkedpost,
        })
      );
    },
  });
  

  const commentMutation = useMutation<Post, Error, string>({
    mutationFn: async (newComment: string) => {
      if (!post) throw new Error("Post not loaded");
      const updatedComments = [...post.comments, newComment];
      const updatedPost: Post = { ...post, comments: updatedComments };
      await api.put(`/blogwebsite/${post.id}`, updatedPost);
      return updatedPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id as string] });
    },
  });

  const deleteCommentMutation = useMutation<Post, Error, number>({
    mutationFn: async (index: number) => {
      if (!post) throw new Error("Post not loaded");
      const updatedComments = post.comments.filter((_, i) => i !== index);
      const updatedPost: Post = { ...post, comments: updatedComments };
      await api.put(`/blogwebsite/${post.id}`, updatedPost);
      return updatedPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id as string] });
    },
  });

  if (isLoading) return <p>Loading post...</p>;
  if (error) return <p>Error loading post.</p>;
  if (!post) return <p>No post found.</p>;



  const handleLike = () => {
    if (!isAuthenticated) {
      navigate('/profile');
      return;
    }
    if (isLiked) {
      likeMutation.mutate(-1);
      dispatch(removeLikedPost(post.id));
    } else {
      likeMutation.mutate(1);
      dispatch(addLikedPost(post));
    }
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      navigate('/profile');
      return;
    }
    if (isBookmarked) {
      bookmarkMutation.mutate(-1);
      dispatch(removeBookmarkedPost(post.id));
    } else {
      bookmarkMutation.mutate(1);
      dispatch(addBookmarkedPost(post));
    }
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/profile');
      return;
    }
    if (comment.trim() === "") return;
    commentMutation.mutate(comment);
    setComment("");
  };

  const handleDeleteComment = (index: number) => {
    if (!isAuthenticated) {
      navigate('/profile');
      return;
    }
    deleteCommentMutation.mutate(index);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-96 object-cover rounded-lg mb-4"
      />
      <p className="text-lg mb-4">{post.content}</p>
      <div className="flex items-center gap-4 text-gray-600">
        <span>{post.likes} Likes</span>
        <span>{post.bookmarks} Bookmarks</span>
      </div>
      <div className="mt-4">
        <button
          onClick={handleLike}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          {isLiked ? 'Unlike' : 'Like'}
        </button>
        <button
          onClick={handleBookmark}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
        </button>
      </div>
 

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {post.comments && post.comments.length > 0 ? (
          <ul className="space-y-2">
           {post.comments.map((c, index) => (
              <li key={index} className="border p-2 rounded flex justify-between items-center">
                <span>{c}</span>
                <button
                  onClick={() => handleDeleteComment(index)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          
        ) : (
          <p>No comments yet.</p>
        )}

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full border p-2 rounded"
            />
            <button type="submit" className="mt-2 bg-purple-500 text-white px-4 py-2 rounded">
              Submit Comment
            </button>
          </form>
        ) : (
          <p>
            Please <Link to="/signin" className="text-blue-500 underline">sign in</Link> to add a comment.
          </p>
        )}
      </div>
    </div>
  );
};

export default PostDetails;