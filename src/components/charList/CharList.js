import './charList.scss';
import { useState, useEffect } from 'react';
import MarvelService from '../../services/MarvelService';
import errorGif from '../errorMessage/error.gif';
import PropTypes from 'prop-types';

const CharList = ({ onCharSelected }) => {
  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [charEnded, setCharEnded] = useState(false);
  const [selectedCharId, setSelectedCharId] = useState(null);

  const marvelService = new MarvelService();

  useEffect(() => {
    onRequest(0);
  }, []);

  const onRequest = (offset = 0) => {
    onCharListLoading();

    marvelService
      .getAllCharacters(offset)
      .then(onCharListLoaded)
      .catch(onError);
  };

  const onCharListLoading = () => {
    setNewItemLoading(true);
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;

    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList((prevList) => [...prevList, ...newCharList]);
    setLoading(false);
    setNewItemLoading(false);
    setOffset((prevOffset) => prevOffset + 9);
    setCharEnded(ended);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
    setNewItemLoading(false);
  };

  const onCharClick = (charId) => {
    setSelectedCharId(charId);
    onCharSelected(charId);
  };

  if (error) {
    return <img src={errorGif} alt="error" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="char__list">
      <ul className="char__grid">
        {charList.map((char) => (
          <li
            key={char.id}
            onClick={() => onCharClick(char.id)}
            className={`char__item ${
              selectedCharId === char.id ? 'char__item_selected' : ''
            }`}
          >
            <img
              src={char.thumbnail}
              alt={char.name}
              onError={(e) => {
                e.target.src = errorGif;
              }}
            />

            <div className="char__name">{char.name}</div>
          </li>
        ))}
      </ul>

      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        onClick={() => onRequest(offset)}
        style={{ display: charEnded ? 'none' : 'block' }}
      >
        <div className="inner">
          {newItemLoading ? 'loading...' : 'load more'}
        </div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
