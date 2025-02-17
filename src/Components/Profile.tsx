import { useSelector,useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../Redux/Slices/authslice';
import api from '../Service/api';

const Profile = () => {
  
  const { isAuthenticated, username, email,userId } = useSelector((state: any) => state.auth)

  const dispatch = useDispatch();
  const navigate=useNavigate();

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
     
      <div className="mt-8 flex gap-4">
        <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-2 rounded">Logout</button>
        <button onClick={handleDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded">Delete Account</button>
      </div>
      
    </div>
  );
};

export default Profile;
