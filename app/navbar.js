import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/donate">Donate</Link></li>
        <li><Link to="/track-donations">Track Donations</Link></li>
        <li><Link to="/community-projects">Community Projects</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
