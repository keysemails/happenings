import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import moment from 'moment';
import DateInput from './DateInput.jsx';
import FormField from './FormField.jsx';

class EventInfoForm extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      location: '',
      year: '',
      month: '',
      day: '',
      hour: '',
      minute: '',
      description: '',
      errorMsg: '',

      redirectToEventPage: false
    }
    // the ISO 8601 supported string format we use.
    // TODO: move to constants file
    this.DATE_FORMAT_STRING = 'YYYY-MM-DD HH:mm';
  }
  componentDidMount() {
    // TODO: be better
    if (!!this.props.post) {
      this.fillForm(this.props.post);
    }
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  separate = (datestr) => {
    let [date, time] = datestr.split(' ');
    let [year, month, day] = date.split('-');
    let [hour, minute] = time.split(':');
    return ({ year, month, day, hour, minute });
  }
  // populates form with data if event exists already!
  fillForm = ({ title, description, location, date_string }) => {
    const { year, month, day, hour, minute } = this.separate(date_string);
    this.setState({
      title, description, location,
      year, month, day, hour, minute
    });
    if (!this.isFutureEvent(this.parseDate(year, month, day, hour, minute))) {
      this.setState({redirectToEventPage: true});
      console.error('cant edit past events!! they are immutably frozen in time :)');
    }
  }
  parseDate = (year, month, day, hour, minute) => {
    let dateStr = `${year}-${month}-${day} ${hour}:${minute}`;
    return moment(dateStr, this.DATE_FORMAT_STRING);
  }
  getValidDate = () => {
    let eventMomentObj = this.parseDate(this.state);
    const isValid = eventMomentObj.isValid();
    const isFutureEvent = this.isFutureEvent(eventMomentObj);
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
  isFutureEvent(eventMomentObj) {
    const thisVeryMoment = moment();
    return eventMomentObj > thisVeryMoment;
  }
  handleSubmit = (event) => {
    event.preventDefault();
    const dateObj = this.getValidDate();
    if (dateObj == false) {
      console.error(this.state.errorMsg);
    } else {
      const { title, location, description } = this.state;
      const timestamp = dateObj.valueOf();  // UNIX timestamp for DB :)
      const date_string = dateObj.format(this.DATE_FORMAT_STRING);
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
