import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addrecipeView from './views/addrecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0)Update results view to mark selected search result
    resultView.render(model.getSearchResultsPage());

    // 1)loading recipe
    await model.loadRecipe(id);

    // 2)rendering reipe
    // const { recipe } = model.state;

    recipeView.render(model.state.recipe);

    // 3)updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();

    // 1)get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2)loard serach result
    await model.loadSearchResult(query);

    // 3)Render result
    resultView.render(model.getSearchResultsPage());

    // 4)Render initial pagination buttons
    paginationView.render(model.state.serch);

    // resultView.render(model.state.serch.result);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1)Render new result
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2)Render new pagination buttons
  paginationView.render(model.state.serch);
};

const controlServings = function (newServing) {
  //update the recipe servings
  model.updateServings(newServing);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

/////////////////////// ////////////////
// controlRecipes();
const controlAddBookmark = function () {
  // 1)add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2)update recipe view
  recipeView.update(model.state.recipe);

  // 3)render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addrecipeView.renderSpinner();

    //upload new recipe data
    await model.upload(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // success message
    addrecipeView.renderMessage();

    // Render bookmarks view
    // bookmarksView.render(model.state.bookmarks);

    // CHANGE ID IN URL
    // window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addrecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err.message);
    addrecipeView.renderError(err);
  }
};

console.log('new feature');

const init = function () {
  bookmarksView.addHandlerRender(controlAddBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addrecipeView.addHandlerUpload(controlAddRecipe);
  console.log('as');
};
init();
