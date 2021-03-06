import React from 'react'
import {connect} from 'react-redux';
import _ from 'lodash';
import {getProjects, getLoggedUser, getUserLogTimeEntries, logTimeEntry, logTimeEntryDone} from '../actions'
import LogTimeEntry from '../components/LogTimeEntry.jsx'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props.getProjects().then(() => {
      this.props.getLoggedUser().then(() => {
        this.props.getUserLogTimeEntries(this.props.user.id)
      });
    }).catch((error) => {
    });
  }

  render() {
    const userLogTimeEntries = this.props.userLogTimeEntries.map(timeEntry => {
      return (
        <LogTimeEntry key={'logTimeEntry-' + timeEntry.id}
                      loggedTimeEntryId={this.props.loggedTimeEntryId}
                      id={timeEntry.id}
                      issueId={timeEntry.issue.id}
                      subject={timeEntry.issue.subject}
                      comment={timeEntry.comments}
                      hours={timeEntry.hours}
                      logDate={timeEntry.spent_on}
                      projectName={timeEntry.project.name}
                      onLogTimeEntry={this.props.onLogTimeEntry}
                      onLogTimeEntryDone={this.props.onLogTimeEntryDone}
                      loggedIssueId={this.props.loggedIssueId}
        />
      );
    });
    return (
      <div className="col-md-10">
        <div className="row">
          <div className="col-md-9">
            <div className="page-header">
              <h1>Report from hell</h1>
              <p className="lead">Hi {this.props.user.firstname}! See your last 10 time entries</p>
            </div>
          </div>
          <div className="col-md-3">
            <span className="rfh-white-rabbit">Check your time on <a target="_blank" href="https://time.ideato.it/">white rabbit</a></span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ul className="list-group rfh-issues-list" ref="issuesList">
              {userLogTimeEntries}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  if (!_.isEmpty(state.user.error)) {
    alert(state.user.error.data + '\n' + state.user.error.status + '\n');
    return;
  }
  if (!_.isEmpty(state.userLogTimeEntries.error)) {
    alert(state.user.userLogTimeEntries.data + '\n' + state.user.userLogTimeEntries.status + '\n');
    return;
  }

  return {
    user: state.user,
    userLogTimeEntries: state.userLogTimeEntries,
    loggedIssueId: state.projectIssues.loggedIssueId,
    loggedTimeEntryId: state.projectIssues.loggedTimeEntryId,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogTimeEntry: (issueId, timeEntryDate, hours, comment) => {
      dispatch(logTimeEntry(issueId, timeEntryDate, hours, comment));
    },
    getProjects: () => (dispatch(getProjects())),
    getLoggedUser: () => (dispatch(getLoggedUser())),
    getUserLogTimeEntries: (userId) => {
      dispatch(getUserLogTimeEntries(userId))
    },
    onLogTimeEntryDone: () => {
      dispatch(logTimeEntryDone())
    }
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);
