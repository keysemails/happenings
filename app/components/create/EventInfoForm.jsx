import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import moment from 'moment';
import DateInput from './DateInput.jsx';
import FormField from './FormField.jsx';

import * as AgeRestrictions from '../../constants/ageRestrictions';
import * as DateUtil from '../../util/dates';

class EventInfoForm extends React.Component {
  state = {
    title: '',
    location: '',
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    description: '',
    errorMsg: '',

    // for check boxes
    private: false,
    accessible: false,
    guestsCanInvite: false,
    ageRestriction: AgeRestrictions.AGES_ALL,
    redirectToEventPage: false
  }
  componentDidMount() {
    // TODO: be better. could use an explicit prop
    if (!!this.props.post) {
      this.fillForm(this.props.post);
    }
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  // populates form with data if event exists already!
  fillForm = ({ title, description, location, date_string }) => {
    const { year, month, day, hour, minute } = DateUtil.separate(date_string);
    this.setState({
      title, description, location,
      year, month, day, hour, minute
    });
    if (!DateUtil.isFutureEvent(DateUtil.parseDate(year, month, day, hour, minute))) {
      this.setState({redirectToEventPage: true});
      console.error('cant edit past events!! they are immutably frozen in time :)');
    }
  }
  getValidDate = (state) => {
    let eventMomentObj = DateUtil.parseDate(state);
    const isValid = eventMomentObj.isValid();
    const isFutureEvent = DateUtil.isFutureEvent(eventMomentObj);
    let errorMsg;
    if (!isValid) {
      errorMsg = 'Invalid date format! Sorry we made it hard';
    } else if (!isFutureEvent) {
      errorMsg = 'Creation of past events not currently supported';
    }
    if (isValid && isFutureEvent) {
      return eventMomentObj;
    } else {
      this.setState({errorMsg: errorMsg});
      return false;
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    const dateObj = this.getValidDate(this.state);
    if (dateObj == false) {
      console.error(this.state.errorMsg);
    } else {
      const { title, location, description } = this.state;
      const timestamp = dateObj.valueOf();  // UNIX timestamp for DB :)
      const date_string = dateObj.format(DateUtil.DATE_FORMAT_STRING);
      this.props.handleFormInput({
        title,
        location,
        description,
        timestamp,
        date_string
      });
    }
  }
  render() {
    // can't edit past events, redirect if they try to
    if (this.state.redirectToEventPage) {
      return (<Redirect to={`/event/${this.props.post.postId}`} />)
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormField
            name="title"
            value={this.state.title}
            placeholder="Title"
            handleChange={this.handleChange}
          />
          <FormField
            name="location"
            value={this.state.location}
            placeholder="Location"
            handleChange={this.handleChange}
          />
          <section>
            <DateInput
              year={this.state.year}
              month={this.state.month}
              day={this.state.day}
              hour={this.state.hour}
              handleChange={this.handleChange}
            />
          </section>
          <FormField
            name="description"
            value={this.state.description}
            placeholder="Description"
            handleChange={this.handleChange}
          />
          <button
            type="submit"
          >Save Changes</button>
        </form>
      </div>
    )
  }
}

EventInfoForm.propTypes = {
  post: PropTypes.object,
  handleFormInput: PropTypes.func
}

export default EventInfoForm;
