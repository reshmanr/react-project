import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './Components/Home/Home'
import Travel from './Components/Travel';
import Food from './Components/Food';
import Diy from './Components/Diy';
import Profile from './Components/Profile';
import Layout from './Components/Layout';
import PostDetails from './Components/Postdetails/Postdetails';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'travel', element: <Travel /> },
      { path: 'food', element: <Food /> },
      { path: 'diy', element: <Diy /> },
      { path: 'profile', element: <Profile /> },
      { path: 'post/:id', element:<PostDetails />,}
    ],
  },
]);

function App() {
 

  return (
    <RouterProvider router={router} />
  )
}

export default App
