import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../api/apiConfig';
import EventList from './EventList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function EventSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(delayTimer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 2 || debouncedSearchTerm.length === 0) {
      fetch(`${BASE_URL}/events/?search=${debouncedSearchTerm}&sort=["name", "ASC"]&range=[0, 5]`)
        .then(res => res.json())
        .then(data => setSearchResults(data))
        .catch(err => console.error(err));
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Pesquisar eventos"
          className="search-input"
        />
        <span className="search-icon">
            <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
      {searchResults && <EventList events={searchResults} />}
    </div>
  );
}

export default EventSearch;
