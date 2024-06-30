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
  const scrollbarThumbRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // 2 for fast scroll
    containerRef.current.scrollLeft = scrollLeft.current - walk;
    updateScrollbarThumb();
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // 2 for fast scroll
    containerRef.current.scrollLeft = scrollLeft.current - walk;
    updateScrollbarThumb();
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const updateScrollbarThumb = () => {
    const container = containerRef.current;
    const scrollbarThumb = scrollbarThumbRef.current;
    const containerWidth = container.scrollWidth;
    const containerVisibleWidth = container.clientWidth;
    const scrollRatio = containerVisibleWidth / containerWidth;
    const thumbWidth = containerVisibleWidth * scrollRatio;
    const scrollLeftRatio = container.scrollLeft / container.scrollWidth;
    const thumbOffset = scrollLeftRatio * (containerVisibleWidth - thumbWidth);

    scrollbarThumb.style.width = `${thumbWidth}px`;
    scrollbarThumb.style.transform = `translateX(${thumbOffset}px)`;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseleave', handleMouseUp);
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mouseleave', handleMouseUp);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  useEffect(() => {
    updateScrollbarThumb();
  }, [shows]);

  return (
    <div>
      <a href='/' className='heading'>Recommended shows <span>&rarr;</span></a>
      <div className="recommended-container" ref={containerRef}>
        {shows.map((show, index) => (
          <div
            key={show.eventName}
            className={`recommended-card ${showHighlight && index === highlightIndex ? 'highlight' : ''}`}
          >
            <img src={show.imgUrl} alt={show.eventName} className="recommended-image" draggable="false" />
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
      <div className="scrollbar-container">
        <div className="scrollbar-track">
          <div className="scrollbar-thumb" ref={scrollbarThumbRef}></div>
        </div>
      </div>
    </div>
  );
};

export { RecommendedShows };
