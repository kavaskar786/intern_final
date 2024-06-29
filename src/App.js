import React from 'react';
import { RecommendedShows } from './components/RecommendedShows';
import { UpcomingEvents } from './components/UpcomingEvents';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="background-container"></div>
      <div className="content-wrapper">
        <LandingPage />
        <RecommendedShows />
        <UpcomingEvents />
      </div>
    </div>
  );
}

export default App;
  