import * as types from '../constants/actionTypes.js'

export const clearSearch = () => ({
  type: types.CLEAR_SEARCH
});

export const updateSearchedEntity = (searchedEntity) => ({
  type: types.UPDATE_SEARCHED_ENTITY,
  searchedEntity
});

export const toggleBar = () => ({
  type: types.TOGGLE_BAR
});
