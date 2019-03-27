// Global App Controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** //? Global State of the app
 * - Search Object
 * - Current Recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

//?Search Controller
const controlSearch = async () => {
  // 1) Get query from the view
  const query = searchView.getInput();
  if (query) {
    // 2) New Search Object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes
      await state.search.getResults();

      // 5) Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert("Something wrong with the search..");
      clearLoader();
    }
  }
};
elements.searchForm.addEventListener("submit", e => {
  controlSearch();
  e.preventDefault();
});

elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

//? Recipe Controller

const controlRecipe = async () => {
  //Get ID from url
  const id = window.location.hash.replace("#", "");
  console.log(id);
  if (id) {
    //Prepare UI for changes
    renderLoader(elements.recipe);

    //Create new recipe object
    state.recipe = new Recipe(id);
    console.log(state.recipe);

    try {
      //Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      //Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (err) {
      alert("Error Processing Recipe");
    }
  }
};
// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe));
