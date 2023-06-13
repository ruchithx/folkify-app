import view from './view';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class resultView extends view {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found ,try again';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultView();
