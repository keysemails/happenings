import * as types from '../constants/actionTypes.js';

// modal will have some ID associated with it (i.e. which post it is)
export const toggleModal = (modalName) => ({
	type: types.TOGGLE_MODAL,
	modalName
});
