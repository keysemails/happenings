import * as types from '../constants/actionTypes.js';

const modalsReducer = (state = {}, action) => {
	switch(action.type) {
		case types.TOGGLE_MODAL:
			return {
				...state, [action.modalName]: action.value
			};
		case types.CLOSE_MODAL:
			return {
				...state, [action.modalName]: false
			}
		default:
			return state;
	}
};

export default modalsReducer;