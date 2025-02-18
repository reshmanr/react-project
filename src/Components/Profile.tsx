import { useSelector,useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../Redux/Slices/authslice';
import api from '../Service/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const Profile = () => {
  
  const { isAuthenticated, username, email,userId,likedposts, bookmarkedposts } = useSelector((state: any) => state.auth)

  const dispatch = useDispatch();
  const navigate=useNavigate();
  const queryClient=useQueryClient();

  const handleLogout = () => {
    dispatch(signOut());
    navigate('/');
  }

  const handleDeleteAccount = async () => {
    try {

      await api.delete(`/users/${userId}`);
      dispatch(signOut());
      alert('Account deleted')
      navigate('/');
      
    } catch (err) {
      console.error("Failed to delete account", err);
      alert("Failed to delete account");
    }
  };

  const { data: myPosts, isLoading, error} = useQuery({
    queryKey: ['myPosts', username],
    queryFn: async () => {
      try {
        const res = await api.get(`/blogwebsite?author=${username}`);
        return res.data;
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          return []; 
        }
        throw err;
      }
    },
    enabled: !!username,
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      await api.delete(`/blogwebsite/${postId}`);
      return postId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPosts', username] });
     
    },
  });


  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-32 p-4">
        <h2 className="text-2xl font-bold mb-4">Welcome To A Slice of My LIFE</h2>
        <div className="mt-4 ">
          <Link to="/signin" className="text-blue-500 underline mr-4">
            Sign In
          </Link>
          <Link to="/signup" className="text-blue-500 underline">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p>
        <strong>Username:</strong> {username}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Liked Posts</h2>
        {likedposts && likedposts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {likedposts.map((post: any) => (
              <div key={post.id} className="w-24">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-24 object-cover rounded"
                />
                <p className="text-xs text-center">{post.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No liked posts.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Bookmarked Posts</h2>
        {bookmarkedposts && bookmarkedposts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {bookmarkedposts.map((post: any) => (
              <div key={post.id} className="w-24">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-24 object-cover rounded"
                />
                <p className="text-xs text-center">{post.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No bookmarked posts.</p>
        )}
      </div>
     
      <div className="mt-4">
        <Link 
          to="/create-post" 
          className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
        >
          Create Post
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">My Posts</h2>
        {isLoading ? (
          <p>Loading posts...</p>
        ) : error ? (
          <p>Error loading posts.</p>
        ) : myPosts && myPosts.length > 0 ? (
          <ul className="space-y-2">
            {myPosts.map((post: any) => (
              <li key={post.id} className="border p-2 rounded flex justify-between items-center">
                <span className="text-sm">{post.title}</span>
                <button
                  onClick={() => deletePostMutation.mutate(post.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts created yet.</p>
        )}
      </div>
       
      <div className="mt-8 flex gap-4">
        <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-2 rounded">Logout</button>
        <button onClick={handleDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded">Delete Account</button>
      </div>
      
    </div>
  );
};

export default Profile;
