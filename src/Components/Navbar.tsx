import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (

      <nav className='flex justify-around font-bold py-8 bg-gray-400'> 
        <div className='font-serif text-3xl '>
          A Slice of life.
        </div>
        
       
        <ul className='flex gap-6 font-mono text-xl '>
          <li className='hover:border-b-2 border-black '>
            <NavLink 
              to="/" >
              Home
            </NavLink>
          </li>
          <li className='hover:border-b-2 border-black '>
            <NavLink 
              to="/travel" >
              Travel
            </NavLink>
          </li>
          <li className='hover:border-b-2 border-black '>
            <NavLink 
              to="/food" >
              Food
            </NavLink>
          </li>
          <li className='hover:border-b-2 border-black '>
            <NavLink 
              to="/diy" >
              DIY
            </NavLink>
          </li>
        </ul>
        
        <div className="font-mono text-xl hover:border-b-2 border-black ">
            <NavLink 
              to="/profile" >
              Profile
            </NavLink>
        </div>
    
      </nav>

  );
};

export default Navbar;
