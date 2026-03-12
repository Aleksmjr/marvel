import errorGif from '../components/errorMessage/error.gif';

class MarvelService {
  _apiBase = process.env.REACT_APP_API_BASE;
  _apiKey = process.env.REACT_APP_API_KEY;

  _baseOffset = 9;

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(
        `Ошибка получения данных с ${url}, status: ${res.status}`,
      );
    }

    return await res.json();
  };

  getAllCharacters = async (offset = 0) => {
    const res = await this.getResource(
      `${this._apiBase}/characters?limit=9&offset=${offset}&${this._apiKey}`,
    );
    return res.data.results.map(this._transformCharacter);
  };

  getLimitCharacters = async (offset = 0) => {
    const res = await this.getResource(
      `${this._apiBase}/characters?limit=${offset}offset=${offset}&${this._apiKey}`,
    );
    return res.data.results.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}/characters/${id}?${this._apiKey}`,
    );
    return this._transformCharacter(res.data.results[0]);
  };

  _transformCharacter = (char) => {
    const description = char.description
      ? char.description.slice(0, 150) +
        (char.description.length > 150 ? '...' : '')
      : 'There is no description for this character';

    return {
      id: char.id,
      name: char.name,
      description: description,
      thumbnail:
        char?.thumbnail?.path && char?.thumbnail?.extension
          ? `${char.thumbnail.path}.${char.thumbnail.extension}`
          : errorGif,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
}

export default MarvelService;
