import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 1000vh;
`;

const EventCard = styled.div`
  border: 1px solid #B0BABF;
  border-radius: 5px;
  overflow: hidden;
  background: #fff;
  margin-bottom: 10px;
  padding: 10px;
`;

const Image = styled.img`
  width: 10%;
  height: auto;
`;

const Title = styled.h3`
  color: #1E2022;
  font-size: 1rem;
  margin: 10px 0;
`;

const Subtitle = styled.p`
  color: #989090;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 10px;
`;



const MAX_PAGES = 5;

const convertDriveLink = (url) => {
  const fileIdMatch = url.match(/d\/(.*?)\//);
  const fileId = fileIdMatch[1];
  return `https://drive.google.com/thumbnail?id=${fileId}`;
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
    <Container>
      {events.map((event, index) => (
        <EventCard key={event.eventName} ref={index === events.length - 1 ? lastEventElementRef : null}>
          <Image src={event.imgUrl} alt={event.eventName} />
          <Title>{event.eventName}</Title>
          <Subtitle>{event.cityName}</Subtitle>
          <Subtitle>{new Date(event.date).toLocaleDateString()}</Subtitle>
          <Subtitle>{event.weather}</Subtitle>
        </EventCard>
      ))}
      {loading && <LoadingSpinner>Loading...</LoadingSpinner>}
    </Container>
  );
};

export { UpcomingEvents };
