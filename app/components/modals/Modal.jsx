import React from 'react';
import { modalTypes as MODAL_TYPES } from '../../constants/modalTypes.js';
import PostOptionModalContainer from './PostOptionModalContainer';

class Modal extends React.Component {
	constructor(props) {
		super(props);
	}

	resetModal = () => {
		this.props.closeModal(this.props.modalName);
	}

	render() {
		let modalShown;
		switch(this.props.modalName) {
			case MODAL_TYPES.POST_OPTIONS_MODAL:
				modalShown = 'bitchh';
			default:
				modalShown = '';
		}
		return (
			<div className={`modal`}>
				<div className='modal-box'>
					<div className='close-modal-x' onClick={this.resetModal}>[x]</div>
					{modalShown}
				</div>
			</div>
		)
	}
}

export default Modal;
