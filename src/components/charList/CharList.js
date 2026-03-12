import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import errorGif from '../errorMessage/error.gif';
class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 0,
    charEnded: false,
  };
  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    this.setState(({ offset, charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  render() {
    const { charList, offset, newItemLoading, charEnded } = this.state;
    return (
      <div className="char__list">
        <ul className="char__grid">
          {charList.map((char) => (
            <li
              key={char.id}
              onClick={() => this.props.onCharSelected(char.id)}
              className="char__item"
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
          onClick={() => this.onRequest(offset)}
          style={{ display: charEnded ? 'none' : 'block' }}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
