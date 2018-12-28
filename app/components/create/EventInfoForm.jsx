import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

import * as AgeRestrictions from '../../constants/ageRestrictions';
import * as DateUtil from '../../utils/dates';

import DateInput from './DateInput';
import FormField from './FormField';
import EventCheckboxForm from './EventCheckboxForm';

class EventInfoForm extends React.Component {
  // TODO: wtf is this doing here
  state = {
    redirectToEventPage: false,
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
    const fieldName = event.target.name;
    const value = event.target.value;
    this.props.updateFormField(fieldName, value);
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
            formData={this.props.formData}
            handleChange={this.props.updateFormField}
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
