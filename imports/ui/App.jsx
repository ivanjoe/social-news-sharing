import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      timeSelect: 10,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const textDOM = ReactDOM.findDOMNode(this.refs.textInput);
    const titleDOM = ReactDOM.findDOMNode(this.refs.titleInput);
    const text = textDOM.value.trim();
    const title = titleDOM.value.trim();

    var div1 = ReactDOM.findDOMNode(this.refs.divTextInput);
    var div2 = ReactDOM.findDOMNode(this.refs.divTitleInput);


    Meteor.call('tasks.insert', title, text, (err) => {
        div1.className += " has-danger";
        div2.className += " has-danger";
        if(err === undefined) {
          div1.className = "form-group";
          div2.className = "form-group";
        }
      }
    );

    // Clear form
    textDOM.value = '';
    titleDOM.value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  updateTime() {
    this.setState({
      timeSelect: ReactDOM.findDOMNode(this.refs.timeSelect).value.trim(),
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    let ago = Date.now() - this.state.timeSelect * 1000;

    filteredTasks = filteredTasks.filter(task => (task.createdAt > ago));
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col s12">
            <header>
              <h1>News in Havana ({this.props.incompleteCount})</h1>

              <div className="row">
                <div className="col s4">
                  <label htmlFor="timeSelect">Filter by time</label>
                  <select
                    className="browser-default"
                    id="timeSelect"
                    ref="timeSelect"
                    onChange={this.updateTime.bind(this)}
                  >
                    <option value="10">10 sec</option>
                    <option value="300">5 min</option>
                    <option value="259200">3 days</option>
                    <option value="604800">7 days</option>
                  </select>
                </div>
                <div className="col s8">
                  <AccountsUIWrapper />
                </div>
              </div>

             { this.props.currentUser ?
              <div className="row">
                <form className="col s12" onSubmit={this.handleSubmit.bind(this)} >
                  <div className="input-field" ref="divTitleInput">
                    <input
                      type="text"
                      id="titleInput"
                      ref="titleInput"
                      placeholder="Title"
                      className="form-control"
                    />
                  </div>
                  <div className="input-field" ref="divTextInput">
                    <textarea
                      type="text"
                      id="textInput"
                      ref="textInput"
                      placeholder="Type to add new news"
                      className="materialize-textarea"
                      rows="3"
                    />
                  </div>
                  <input
                    type="submit"
                    ref="submitButton"
                    placeholder="Submit"
                    className="btn btn-primary"
                  />
                </form></div>: ''
              }
            </header>
          </div>
        </div>

        <div className="row news-container">
          {this.renderTasks()}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
