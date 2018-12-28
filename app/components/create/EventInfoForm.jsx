import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

import * as AgeRestrictions from '../../constants/ageRestrictions';
import * as DateUtil from '../../util/dates';

import DateInput from './DateInput.jsx';
import FormField from './FormField.jsx';
import EventCheckboxForm from './EventCheckboxForm.jsx';

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
    redirectToEventPage: false,

    // these are checkbox form states
    private: false,
    accessible: false,
    guestsCanInvite: false,
    ageRestriction: AgeRestrictions.AGES_ALL,
  }
  componentDidMount() {
    // TODO: be better. could use an explicit prop
    if (!!this.props.post) {
      this.props.fillFormData(this.props.post);
      // TODO: date validation
      // if (!DateUtil.isFutureEvent(DateUtil.parseDate(year, month, day, hour, minute)))
    }
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
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
            value={this.props.formData.title}
            placeholder="Title"
            handleChange={this.handleChange}
          />
          <FormField
            name="location"
            value={this.props.formData.location}
            placeholder="Location"
            handleChange={this.handleChange}
          />
          <section>
            <DateInput
              year={this.props.formData.year}
              month={this.props.formData.month}
              day={this.props.formData.day}
              hour={this.props.formData.hour}
              handleChange={this.handleChange}
            />
          </section>
          <FormField
            name="description"
            value={this.props.formData.description}
            placeholder="Description"
            handleChange={this.handleChange}
          />
          <EventCheckboxForm
            checkboxStates={{...this.state.checkboxes}}
            handleChange={(checkboxName, val) => this.setState([checkboxName]: val)}
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
