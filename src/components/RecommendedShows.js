import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../css/RecommendedShows.css';

const convertDriveLink = (url) => {
  const fileIdMatch = url.match(/d\/(.*?)\//);
  const fileId = fileIdMatch ? fileIdMatch[1] : null;
  return fileId ? `https://drive.google.com/thumbnail?id=${fileId}` : url;
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
    <div className="recommended-container" ref={containerRef}>
      {shows.map((show, index) => (
        <div
          key={show.eventName}
          className={`recommended-card ${showHighlight && index === highlightIndex ? 'highlight' : ''}`}
        >
          <img src={show.imgUrl} alt={show.eventName} className="recommended-image" />
          <div className="recommended-details">
            <h3 className="recommended-title">{show.eventName}</h3>
            <p className="recommended-subtitle">{show.cityName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export { RecommendedShows };
