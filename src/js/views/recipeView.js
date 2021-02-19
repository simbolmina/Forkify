import View from './View.js';

// import icons from '../img/icons.svg' // parcel 1
import icons from 'url:../../img/icons.svg'; // parcel 2
//icons in our source folder is no longer used since we used parcel. so we need to show parcel where it should get icons by imporing them from our source folder.
import { Fraction } from 'fractional';
//to convert ingredients amounts to be shown like 1/2 instead of 0.5

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  //if each view elements has the the same parent, it will be easer to add new classes/views.
  _errorMessage = 'We could not find the receipe. Please try another';
  _message = '';

  //publisher-subscriber handler.
  addHandlerRender(handler) {
    //adding event listener to hashchange (id in link) to renderRecipe funtion. whenever id is changed recipe will be loaded. if we want to copy complete link with has to another browser tab it should be open as well, thats why we add a load event as well.
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
    //instead of writing numerious event listener for the same funtionaltiy we can write just one line of code. we loop over and array of events and add event listeners. so we can avoid code below.
    // window.addEventListener('hashchange', handler);
    // window.addEventListener('load', handler);
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--increase-servings');
      if (!btn) return;

      const { updateTo } = btn.dataset;

      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  //renders recipe html
  _generateMarkup() {
    return `<figure class="recipe__fig">
    <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this._data.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._data.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._data.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--increase-servings" data-update-to="${
          this._data.servings - 1
        }">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--increase-servings" data-update-to="${
          this._data.servings + 1
        }">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>

    <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
      </svg>
    </button>
  </div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
     ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
  </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this._data.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>`;
    //ingreadients are a list of array. we loop over the array and join them, turning them into big string.
  }
  // funtions to show amount of ingredients.
  _generateMarkupIngredient(ing) {
    return `
 <li class="recipe__ingredient">
   <svg class="recipe__icon">
     <use href="${icons}#icon-check"></use>
   </svg>
   <div class="recipe__quantity">${
     //we used Fraction API to convert quantities.
     ing.quantity ? new Fraction(ing.quantity).toString() : ''
   }</div>
   <div class="recipe__description">
     <span class="recipe__unit">${ing.unit}</span>
     ${ing.description}
   </div>
 </li>
 `;
  }
}

export default new RecipeView();
