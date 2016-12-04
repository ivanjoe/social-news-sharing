import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

// Task component - represents a single todo item
export default class Task extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = this.props.task.checked ? 'checked col-lg-4 news' : 'col-lg-4 news';
    var timeAgo = moment(this.props.task.createdAt).fromNow()

    return (
      <div className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>

        <h4>{this.props.task.title}</h4>

        <span className="text">
          {this.props.task.text}
          <div className="row">
            <div className="col-xs-6">
              <p className="blockquote-footer">{this.props.task.username}</p>
            </div>
            <div className="col-xs-6">
              <p className="text-xs-right small"><em>{timeAgo}</em></p>
            </div>
          </div>
        </span>
      </div>
    );
  }
}

Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
};