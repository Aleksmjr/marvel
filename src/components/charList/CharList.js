import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import errorGif from '../errorMessage/error.gif';
class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
  };
  marvelService = new MarvelService();

  componentDidMount() {
    this.marvelService
      .getLimitCharacters()
      .then(this.onCharListLoaded)
      .catch(this.onError);
  }

  onCharListLoaded = (charList) => {
    this.setState({
      charList,
      loading: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  render() {
    const { charList } = this.state;
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
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
