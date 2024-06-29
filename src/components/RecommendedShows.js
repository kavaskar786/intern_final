import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import '../css/RecommendedShows.css';

const convertDriveLink = (url) => {
  const fileIdMatch = url.match(/d\/(.*?)\//);
  const fileId = fileIdMatch ? fileIdMatch[1] : null;
  return fileId ? `https://drive.google.com/thumbnail?id=${fileId}` : url;
};

const formatDate = (dateString) => {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatDistance = (meters) => {
  const km = meters / 1000;
  return km.toFixed(2) + ' Km';
};

const RecommendedShows = () => {
  const [shows, setShows] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [showHighlight, setShowHighlight] = useState(true);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    axios.get('https://gg-backend-assignment.azurewebsites.net/api/Events?code=FOX643kbHEAkyPbdd8nwNLkekHcL4z0hzWBGCd64Ur7mAzFuRCHeyQ==&type=rec')
      .then(response => {
        const showsWithDirectImageLinks = response.data.events.map(show => ({
          ...show,
          imgUrl: convertDriveLink(show.imgUrl)
        }));
        setShows(showsWithDirectImageLinks);
      })
      .catch(error => {
        console.error('Error fetching recommended shows:', error);
      });
  }, []);

  const handleKeyDown = (e) => {
    if (containerRef.current) {
      let newIndex = highlightIndex;
      if (e.key === 'ArrowRight') {
        newIndex = (highlightIndex + 1) % shows.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (highlightIndex - 1 + shows.length) % shows.length;
      }
      setHighlightIndex(newIndex);
      setShowHighlight(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowHighlight(false), 2000);

      const card = containerRef.current.children[newIndex];
      const cardRect = card.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();


      if (cardRect.left < containerRect.left || cardRect.right > containerRect.right) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [highlightIndex, shows]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    lastTime.current = Date.now();
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // 2 for fast scroll
    containerRef.current.scrollLeft = scrollLeft.current - walk;
    const now = Date.now();
    velocity.current = (walk / (now - lastTime.current)) * 10; // calculate velocity
    lastTime.current = now;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    let scroll = containerRef.current.scrollLeft;
    const scrollStep = () => {
      scroll += velocity.current * 0.95; // Reducing velocity
      containerRef.current.scrollLeft = scroll;
      velocity.current *= 0.95; // Apply friction

      if (Math.abs(velocity.current) > 0.5) {
        requestAnimationFrame(scrollStep);
      }
    };
    scrollStep();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mouseleave', handleMouseUp);
      }
    };
  }, []);

  return (
    <div>
      <a href='' className='heading'>Recommended shows <span>&rarr;</span></a>
    <div className="recommended-container" ref={containerRef}>
      {shows.map((show, index) => (
        <div
          key={show.eventName}
          className={`recommended-card ${showHighlight && index === highlightIndex ? 'highlight' : ''}`}
        >
          <img src={show.imgUrl} alt={show.eventName} className="recommended-image" />
          <div className="recommended-details">
            <div className='tit_cit'>
            <h5 className="recommended-title">{show.eventName}</h5>
            <p className="recommended-subtitle">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {show.cityName}
            </p>
            </div>
            <div className='dat_wet'>
            <p className="recommended-subtitle">{formatDate(show.date)}</p>
            <p className="recommended-subtitle2">{show.weather} | {formatDistance(show.distanceKm)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export { RecommendedShows };
