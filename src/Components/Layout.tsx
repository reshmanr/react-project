import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer/Footer';

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer/>
    </>
  );
};

export default Layout;
