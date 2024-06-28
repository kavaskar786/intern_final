import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  overflow-x: scroll;
  padding: 10px 0;
`;

const EventCard = styled.div`
  min-width: 200px;
  margin-right: 10px;
  border: 1px solid #B0BABF;
  border-radius: 5px;
  overflow: hidden;
  background: #fff;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;

const Title = styled.h3`
  color: #1E2022;
  font-size: 1rem;
  margin: 10px;
`;

const RecommendedShows = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    axios.get('https://gg-backend-assignment.azurewebsites.net/api/Events?code=FOX643kbHEAkyPbdd8nwNLkekHcL4z0hzWBGCd64Ur7mAzFuRCHeyQ==&type=rec')
      .then(response => {
        setShows(response.data.events);
      })
      .catch(error => {
        console.error('Error fetching recommended shows:', error);
      });
  }, []);

  return (
    <Container>
      {shows.map(show => (
        <EventCard key={show.eventName}>
          <Image src={show.imgUrl} alt={show.eventName} />
          <Title>{show.eventName}</Title>
        </EventCard>
      ))}
    </Container>
  );
};

export { RecommendedShows };
