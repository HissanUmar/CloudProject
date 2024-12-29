import React from 'react';
import { useNavigate } from 'react-router-dom'

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

const SideBar = () => {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    console.log('Logged out successfully');
    // Navigate to the login page (or any other page after logout)
    navigate('/login');
  }

  return (
    <div className='' style={{ height: '100vh', position: 'fixed', width: '200px'}}>
      <Sidebar style={{ height: '100vh', width: '200px' }}>
        <Menu>
          <MenuItem onClick={() => navigate('/home')}> Home </MenuItem>
          <MenuItem onClick={() =>navigate('/upload')}> Upload </MenuItem>
          <MenuItem onClick={logout}> Logout </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SideBar;
