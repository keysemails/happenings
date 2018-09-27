import * as types from '../constants/actionTypes.js';

// modal will have some ID associated with it (i.e. which post it is)
export const closeModal = (modalName) => ({
	type: types.CLOSE_MODAL,
	modalName
});

export const openModal = (modalName, value) => ({
	type: types.OPEN_MODAL,
	modalName,
	value
});
