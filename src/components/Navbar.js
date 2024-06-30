import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faBars, faSearch, faHeart ,faUser} from '@fortawesome/free-solid-svg-icons';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <div>
      <nav className='nav_2'>
        <div className='ln_cont'>
          <div className="navbar-left">
            <span className="company-name">BookUsNow</span>
            <div className="location">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span className='loc_det'>Mumbai, India</span>
              <span className="arrow">&gt;</span>
            </div>
          </div>
          <div className='logos'>
            <span>
            <FontAwesomeIcon icon={faSearch} className='icon' />
            </span>
            <span>
              <FontAwesomeIcon icon={faHeart} className='icon' />
            </span>
            <span>
              <FontAwesomeIcon icon={faUser} className='icon' />
            </span>
          </div>
        </div>
        <ul className="nav-list2">
          <li>Live shows</li>
          <li>Streams</li>
          <li>Movies</li>
          <li>Plays</li>
          <li>Events</li>
          <li>Sports</li>
          <li>Activities</li>
        </ul>
      </nav>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="company-name">BookUsNow</span>
          <div className="location">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span className='loc_det'>Mumbai, India</span>
            <span className="arrow">&gt;</span>
          </div>
        </div>
        <div className="navbar-center">
          <div className='but_sea'>
            <button className="categories-button">
              <FontAwesomeIcon icon={faBars} />
              <span>Categories</span>
            </button>
            <div className="search-bar">
              <input type="text" placeholder="DJI phantom" />
              <button className="search-button">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
          <ul className="nav-list">
            <li>Live shows</li>
            <li>Streams</li>
            <li>Movies</li>
            <li>Plays</li>
            <li>Events</li>
            <li>Sports</li>
            <li>Activities</li>
          </ul>
        </div>
        <div className="navbar-right">
          <button className="favorites-button">
            <FontAwesomeIcon icon={faHeart} />
            <span>Favorites</span>
          </button>
          <button className="sign-in-button">Sign In</button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
