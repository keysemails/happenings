import React from 'react';
import classNames from 'classnames';

import { modalTypes as MODAL_TYPES } from '../../constants/modalTypes.js';
import PostOptionsModalContainer from './PostOptionsModalContainer';
import AuthorOptionsModalContainer from './AuthorOptionsModalContainer';

class Modal extends React.Component {
	resetModal = () => {
		this.props.closeModal(this.props.modalName);
	}
	getModal(modalName) {
		let modalShown;
		switch(modalName) {
			case MODAL_TYPES.POST_OPTIONS_MODAL:
				modalShown = (<PostOptionsModalContainer />);
				break;
			case MODAL_TYPES.AUTHOR_OPTIONS_MODAL:
				modalShown = (<AuthorOptionsModalContainer />);
			// do not put a default, it will always get reset to this
		}
		return modalShown;
	}
	render() {
		const modalClass = classNames('modal', {'is-open': !!this.props.modalName});
		return (
			<div className={modalClass}>
				<div className='modal-box'>
					<span onClick={this.resetModal}>[x]</span>
					{this.getModal(this.props.modalName)}
				</div>
			</div>
		)
	}
}

export default Modal;
