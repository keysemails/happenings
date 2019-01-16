import React from 'react';
import PropTypes from 'prop-types';
import { signUpNewUser } from '../utils/auth';
import DrawArea from './signup/DrawArea';

class SignUpForm extends React.Component {
	initialState = {
		email: '',
		userName: '',
		fullName: '',
		password: '',
		passwordConfirm: ''
	}
	state = this.initialState;

	MIN_PASSWORD_LENGTH = 6;

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}
	// TODO: "this username is already taken" etc
	validateUserName = () => {
		return this.state.userName == this.state.userName.toLowerCase();
	}
	validatePassword = () => {
		return (
			(this.state.password == this.state.passwordConfirm) &&
			(this.state.password.length >= this.MIN_PASSWORD_LENGTH)
		)
	}
	// TODO make 'Sign Up' button DISABLED until the truth condition
	// this.validateUserName() && this.validatePassword() is satisfied
	handleSubmit = (event) => {
		event.preventDefault();
		if (this.validateUserName() && this.validatePassword()) {
			const userInfo = this.state;
			signUpNewUser(userInfo);
		} else {
			console.error('something wrong still not letting u sign up yet');
			this.setState(this.initialState);
		}
	}
	render() {
		return (
			<div className='form'>
				Create your account
				<form onSubmit={this.handleSubmit}>
					<input
						type="text"
						name="email"
						value={this.state.email}
						placeholder="Email"
						onChange={this.handleChange}
						className='form-input'
					/>
					<input
						type="text"
						name="userName"
						value={this.state.userName}
						placeholder="Username"
						onChange={this.handleChange}
						className='form-input'
					/>
					<input
						type="text"
						name="fullName"
						value={this.state.fullName}
						placeholder="Full Name"
						onChange={this.handleChange}
						className='form-input'
					/>
					<input
						type="password"
						name="password"
						value={this.state.password}
						placeholder="Password (min 6 chars)"
						onChange={this.handleChange}
						className='form-input'
					/>
					<input
						type="password"
						name="passwordConfirm"
						value={this.state.passwordConfirm}
						placeholder="Confirm Password"
						onChange={this.handleChange}
						className='form-input'
					/>

					<section className='draw-container'>
						<label>Icon</label>
						<DrawArea />
					</section>

					<button
						type="submit"
					>Sign Up</button>
				</form>

			</div>
		)
	}
}

export default SignUpForm;
