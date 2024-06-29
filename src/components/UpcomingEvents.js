import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import '../css/UpcomingEvents.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const MAX_PAGES = 5;

const convertDriveLink = (url) => {
  const fileIdMatch = url.match(/d\/(.*?)\//);
  const fileId = fileIdMatch[1];
  return `https://drive.google.com/thumbnail?id=${fileId}`;
};

const formatDate = (dateString) => {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatDistance = (meters) => {
  const km = meters / 1000;
  return km.toFixed(2) + ' Km';
};

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const fetchEvents = () => {
      setLoading(true);
      axios.get(`https://gg-backend-assignment.azurewebsites.net/api/Events?code=FOX643kbHEAkyPbdd8nwNLkekHcL4z0hzWBGCd64Ur7mAzFuRCHeyQ==&page=${page}&type=upcoming`)
        .then(response => {
          const eventsWithDirectImageLinks = response.data.events.map(event => ({
            ...event,
            imgUrl: convertDriveLink(event.imgUrl)
          }));
          setEvents(prevEvents => [...prevEvents, ...eventsWithDirectImageLinks]);
          setHasMore(response.data.events.length > 0 && page < MAX_PAGES);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching upcoming events:', error);
          setLoading(false);
        });
    };

    if (page <= MAX_PAGES) {
      fetchEvents();
    }
  }, [page]);

  const lastEventElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div>
      <a href='' className='heading2'>Upcoming events <span>&rarr;</span></a>
      <div className="upcoming-container">
        {events.map((event, index) => (
          <div key={event.eventName} className="upcoming-card" ref={index === events.length - 1 ? lastEventElementRef : null}>
            <div className="image-container">
              <div className='img_cont'>
              <img src={event.imgUrl} alt={event.eventName} className="upcoming-image" />
              </div>
              <p className="upcoming-date">{formatDate(event.date)}</p>
            </div>
            <div className="upcoming-details">
              <div>
              <h3 className="upcoming-title">{event.eventName}</h3>
              <p className="upcoming-subtitle"><FontAwesomeIcon icon={faMapMarkerAlt} /> {event.cityName}</p>
              </div>
              <div>
              <p className="upcoming-subtitle">{event.weather} | {formatDistance(event.distanceKm)}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="loading-spinner">Loading...</div>}
      </div>
    </div>
  );
};

export { UpcomingEvents };
