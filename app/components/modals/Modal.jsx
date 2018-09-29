import React from 'react';
import classNames from 'classnames';

import { modalTypes as MODAL_TYPES } from '../../constants/modalTypes.js';
import PostOptionModalContainer from './PostOptionModalContainer';

class Modal extends React.Component {
	resetModal = () => {
		this.props.closeModal(this.props.modalName);
	}

	render() {
		let modalShown;
		switch(this.props.modalName) {
			case MODAL_TYPES.POST_OPTIONS_MODAL:
				modalShown = (<PostOptionModalContainer />);
				break;
			// do not put a default, it will always get reset to this
		}
		const modalClass = classNames('modal', {'is-open': !!this.props.modalName});
		return (
			<div className={modalClass}>
				<div className='modal-box's>
					<span onClick={this.resetModal}>[x]</span>
					{modalShown}
				</div>
			</div>
		)
	}
}

export default Modal;
