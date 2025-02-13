import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header >
      <nav > 
        <div >
          Blog Logo
        </div>
        
       
        <ul>
          <li>
            <NavLink 
              to="/" >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/travel" >
              Travel
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/food" >
              Food
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/diy" >
              DIY
            </NavLink>
          </li>
        </ul>
        
        <div>
            <NavLink 
              to="/profile" >
              Profile
            </NavLink>
        </div>
    
      </nav>
    </header>
  );
};

export default Navbar;
