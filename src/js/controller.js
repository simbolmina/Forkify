import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import AddRecipeView from './views/addRecipeView.js';

//our polyfilling npm packages. they will convert ES6 codes to ES5 for older browsers.
import 'core-js/stable';
import 'regenerator-runtime';
import addRecipeView from './views/addRecipeView.js';

//const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2
// https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

//controlRecepies();
const controlRecepies = async function () {
  try {
    const id = window.location.hash.slice(1);
    //console.log(id);

    if (!id) return; //if there is no id (in link) return. we want to avoid errors because of load event listener without any id (hash) in link.

    recipeView.renderSpinner();
    // Loading recipe
    bookmarksView.update(model.state.bookmarks);

    //update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //render bookmarks view highlight

    await model.loadRecipe(id);
    //asyc funtions will return promise and we need to await response. since there wont be any returned value we dont need to store it.

    // Rendering recipce

    recipeView.render(model.state.recipe);
    //render() will accept data and store in object.
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // get search quesry
    const query = searchView.getQuery();
    if (!query) return;
    // load search results
    await model.loadSearchResults(query);

    // render results
    //console.log(model.state.search.results);
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //render initial pagination buttons

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //render new pagination buttons

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update recipe servings(in state)
  model.updateServings(newServings);

  // update receipeView
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add or remove bookmar
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //console.log(model.state.recipe);
  // update recipe view
  recipeView.update(model.state.recipe); //only update bookmark icon

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //load spinner image
    addRecipeView.renderSpinner();
    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //render recipe
    recipeView.render(model.state.recipe);

    //successful upload message

    addRecipeView.renderMessage();

    // render bookmark view

    bookmarksView.render(model.state.bookmarks);

    // change id in url
    //pushState() will let us change url without reloading page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindows();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('alert', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('welcome');
};

//publisher subscriber pattern implementation
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecepies);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();
