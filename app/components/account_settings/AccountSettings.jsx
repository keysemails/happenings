import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import DrawArea from '../signup/DrawArea';
import { getAuth } from '../../utils/auth';
import { loadUserData } from '../../utils/user';

class AccountSettings extends React.Component {
	constructor() {
		super();
		this.auth = getAuth();
		this.state = {
			email: '',
			fullName: '',
			passWord: '',
			repeatPassword: '',
			shape: ''
		}
	}
	componentDidMount() {
		this.initUserData()
	}
	initUserData = () => {
		if (this.auth.currentUser) {
			this.setState({
				_email: this.auth.currentUser.email
			});
			loadUserData(this.auth.currentUser.uid).then(data => {
				const userData = data.val();
				console.log(userData);
				this.setState({
					_fullName: userData.full_name,
					_userName: userData.username,
					_gotUserData: true
				});
			})
		}
	}
	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}
	handleSubmit = (event) => {
		event.preventDefault();
		if (this.validateUserName() && this.validatePassword()) {
			const userInfo = this.state;
			signUpNewUser(userInfo);
		} else {
			console.error('something wrong still not letting u save settings yet');
			this.setState(this.initialState);
		}
	}
	deleteAccount = () => {
		console.log('TODO')
	}
	render()  {
		if (!this.auth.currentUser) {
			return (<Redirect to='/'/>);
		}
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					email
					<input
						type="text"
						name="email"
						value={this.state.email}
						defaultValue={this.state._email}
						placeholder="email"
						onChange={this.handleChange}
						className='form-input'
					/>
					handle
					<input
						type="text"
						name="userName"
						value={this.state.userName}
						defaultValue={this.state._userName}
						placeholder="username"
						onChange={this.handleChange}
						className='form-input'
					/>
					display name
					<input
						type="text"
						name="fullName"
						value={this.state.fullName}
						defaultValue={this.state._fullName}
						placeholder="display name"
						onChange={this.handleChange}
						className='form-input'
					/>
					password
					<input
						type="password"
						name="password"
						value={this.state.password}
						placeholder="password (at least 6 characters)"
						onChange={this.handleChange}
						className='form-input'
					/>
					password again
					<input
						type="password"
						name="passwordConfirm"
						value={this.state.passwordConfirm}
						placeholder="confirm password"
						onChange={this.handleChange}
						className='form-input'
					/>

					<section className='draw-container'>
						<label>Redraw icon</label>
						<DrawArea />
					</section>

					<button
						type="submit"
					>Save</button>
					<button onClick={this.deleteAccount}>
					Delete ur account
					</button>
				</form>
			</div>
		)
	}
}

AccountSettings.propTypes = {

}

export default AccountSettings;
