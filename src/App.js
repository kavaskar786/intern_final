import React from 'react';
import { RecommendedShows } from './components/RecommendedShows';
import { UpcomingEvents } from './components/UpcomingEvents';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <LandingPage />
      <div className="content-wrapper">
        <RecommendedShows />q
        <UpcomingEvents />
      </div>
    </div>
  );
}

export default App;
