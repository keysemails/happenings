import * as types from '../constants/actionTypes.js';

const modalsReducer = (state = {}, action) => {
	switch(action.type) {
		case types.TOGGLE_MODAL:
			return {
				...state, [action.modalName]: !!!(state[action.modalName])
			};
		default:
			return state;
	}
};

export default modalsReducer;