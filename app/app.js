import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Donate from './Donate';
import TrackDonations from './TrackDonations';
import CommunityProjects from './CommunityProjects';
import NavBar from './NavBar';
import Footer from './Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/donate" component={Donate} />
          <Route path="/track-donations" component={TrackDonations} />
          <Route path="/community-projects" component={CommunityProjects} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
