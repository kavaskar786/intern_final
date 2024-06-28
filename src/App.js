import React from 'react';
import { RecommendedShows } from './components/RecommendedShows';
import { UpcomingEvents } from './components/UpcomingEvents';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="header">Event Showcase</header>
      <RecommendedShows />
      <UpcomingEvents />
    </div>
  );
}

export default App;
