// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

import EventSearch from '../components/EventSearch';

function Home() {
  return (
    <div>
      <EventSearch></EventSearch>
      <div className="create-event-button-container">
        <span className="create-event-text">
          Não achou o seu evento? Crie aqui
        </span>
        <Link to="/events/create" className="custom-link-button">Adicionar novo evento </Link>
      </div>
    </div>
  );
}

export default Home;
