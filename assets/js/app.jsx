
//-------------React File for handling Home Page-----------------//
import React from 'react';
import ReactDOM from 'react-dom'
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router'
import { Button, ButtonToolbar, ButtonGroup, Grid, Row, Col } from 'react-bootstrap'
import { Form, FormGroup, FormControl } from 'react-bootstrap'





//---------------------DOM and Route Rendering-----------------//
ReactDOM.render((
   <Router history = {hashHistory}>
      <Route path = "/" component = {Goals}>
        <IndexRoute component={LifeGoalsList}/>
        <Route path = "editor/:fill" name = "editor" component = {NewGoal}/>
        <Route path = "goal_list" component = {LifeGoalsList}/>
      </Route>
   </Router>
), document.getElementById('goals'));





//--------------Parent Home Controller-----------------//
var Goals = React.createClass({
  render: function() {
    var buttonStyle = {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        border: "2px solid #dcdcdc",
        display: "inline-block",
        fontFamily: "Josefin Sans",
        color: "#666666",
        fontSize: "18",
        fontWeight: "bold",
        padding: "8px 12px 8px 12px",
        margin: "15px 5px 15px 5px",
    }
    var heading = {
      fontFamily: "Lobster"
    }
    return (
      <Grid>
        <Row className="show-grid">
          <Col sm={6} smOffset={3}>
            <Row>
              <Col xs={6}><h1 style={heading}>Life Goals</h1></Col>
              <Col xs={6}>
                <ButtonToolbar>
                  <Link to= "editor/null"><Button style={buttonStyle} bsStyle="primary" bsSize="large">New Goal</Button></Link>
                  <Link to="goal_list"><Button style={buttonStyle} bsSize="large">All Goals</Button></Link>
                </ButtonToolbar>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col sm={6} smOffset={3}>{this.props.children}</Col>
        </Row>
      </Grid>
    );
  }
});





//-----------New Life-Goal Form----------------//
var NewGoal = React.createClass({
  getInitialState: function() {
    return {name: '', text: '', date: '', id: '', url: '/api/goal/'};
  },

  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },

  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleDateChange: function(e) {
    this.setState({date: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var text = this.state.text.trim();
    var date = this.state.date.trim();
    var id = this.state.id;
    if (!text || !name) {
      return;
    }
    this.handleNewLifeGoal({
      name: name, 
      description:text, 
      end_date:date, 
      id:id})
    this.setState({
      name: '', 
      text: '', 
      date: '', 
      id: '', 
      url: '/api/goal/'});
  },

  handleNewLifeGoal: function(goal) {
    $.ajax({
      url: this.state.url,
      dataType: 'json',
      type: 'POST',
      data: goal,
      success: function(data) {
        this.props.history.pushState(null,'goal_list')
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  handleGoalUpdate: function(id) {
    $.ajax({
      url: '/api/update/?id=' + id,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({
          name: data.name,
          text: data.text,
          date: data.end_date,
          id: data.id,
          url: '/api/update/'
        })
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.params.fill != 'null') {
      this.handleGoalUpdate(nextProps.params.fill)
    }
  },

  render: function() {
    var buttonStyle = {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        border: "2px solid #dcdcdc",
        display: "inline-block",
        color: "#666666",
        fontSize: "18",
        fontWeight: "bold",
        padding: "8px 12px 8px 12px",
        margin: "15px 5px 15px 5px",
    }
    var textStyle = {
      fontFamily: "Josefin Sans",
    }
    return (
      <Form style= {textStyle} 
            horizontal className="newGoal" 
            onSubmit={this.handleSubmit}>
        <FormGroup controlId="formHorizontalName">
          <Col componentClass="text" xs={3}>
            Goal Name
          </Col>
          <Col xs={9}>
            <FormControl 
              name = "name"
              type="text" 
              placeholder= "Your Life Goal name"
              value={this.state.name}
              onChange={this.handleNameChange} />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalDate">
          <Col componentClass="date" xs={3}>
            End Date
          </Col>
          <Col xs={9}>
            <FormControl 
              name = "end_date"
              type="date" 
              placeholder="Ends on [YYYY-MM-DD]"
              value={this.state.date}
              onChange={this.handleDateChange} />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalDescription">
          <Col xs={3}>
            Description
          </Col>
          <Col xs={9}>
            <FormControl 
              name = "description"
              componentClass="textarea"
              placeholder="Say something..."
              value={this.state.text}
              onChange={this.handleTextChange} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col xsOffset={5} xs={8}>
            <Button style={buttonStyle} type="submit">
              Submit
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
});





//----------------Life Goal List Handler----------------//
var LifeGoalsList = React.createClass({
  getInitialState: function() {
    return {data: [],
            goalSegregationButton: 'Completed Goals',
            url: '/api/goal/?type=True'};
  },

  componentDidMount: function() {
    $.ajax({
      url: '/api/goal/?type=False',
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.length == 0) {
          this.props.history.pushState(null,'editor/null')
        }
        data.sort(function(a, b) {
          return parseFloat(a.date) - parseFloat(b.date);
        });
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  handleSegregation: function() {
    $.ajax({
      url: this.state.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        data.sort(function(a, b) {
          return parseFloat(a.date) - parseFloat(b.date);
        });
        if (this.state.goalSegregationButton == 'Completed Goals') {
          this.setState({ data: data,
                          goalSegregationButton: 'Uncompleted Goals',
                          url: '/api/goal/?type=False'});
        }
        else {
          this.setState({ data: data,
                          goalSegregationButton: 'Completed Goals',
                          url: '/api/goal/?type=True'});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  handleDelete: function(id) {
    $.ajax({
      url: '/api/delete/',
      dataType: 'json',
      cache: false,
      type: 'POST',
      data: {'id': id},
      success: function(response) {
        var goals = this.state.data
        var index = goals.findIndex(function(item, i) {
          return item.id == response.id
        });
        goals.splice(index, 1);
        this.setState({data: goals})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    var buttonStyle = {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        border: "2px solid #dcdcdc",
        display: "inline-block",
        fontFamily: "Josefin Sans",
        color: "#666666",
        fontSize: "18",
        fontWeight: "bold",
        padding: "8px 12px 8px 12px",
        margin: "15px 5px 15px 5px",
    }
    var goalNodes = this.state.data.map(function(goal) {
      return (
        <LifeGoal onDelete = {this.handleDelete.bind(this, goal.id)} 
                  name = {goal.name} 
                  days = {goal.date} 
                  more = {goal.more} 
                  id= {goal.id} 
                  complete = {goal.complete}> 
          {goal.text} 
        </LifeGoal>
      );
    }.bind(this));
    
    return (
      <div className="life_goals_list">
        {goalNodes}
        <Row>
          <Col xs={6} xsOffset={3}>
            <Button style={buttonStyle} onClick={this.handleSegregation}>
              {this.state.goalSegregationButton}
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
});





//------------------Single Life Goal View Handler----------//
var LifeGoal = React.createClass({
  getInitialState: function() {
    return {complete: this.props.complete, 
            more:this.props.more,
            text:this.props.children}
  },

  handleComplete: function(e){
    
    if (this.state.complete == 'True') {
      var request = {'id': this.props.id, 'completed': 'False'}
    }
    else if (this.state.complete == 'False') {
      var request = {'id': this.props.id, 'completed': 'True'}
    }
    e.preventDefault();
    $.ajax({
      url: '/api/complete/',
      dataType: 'json',
      type: 'POST',
      data: request,
      success: function(data) {
        if (data.completed == 'True'){
          this.setState({complete: 'True'});
        }
        else if (data.completed == 'False') {
          this.setState({complete: 'False'});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      text: nextProps.children,
      complete: nextProps.complete,
      more: nextProps.more
    });
  },

  handleMore: function(){
    $.ajax({
      url: '/api/more/',
      dataType: 'json',
      type: 'POST',
      data: {'id': this.props.id},
      success: function(data) {
        var old_text = this.state.text
        var updated_text = old_text.concat(data.description)
        this.setState({more: '', text: updated_text})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  handleUpdate: function() {
    var url = 'editor/'
    hashHistory.push(url.concat(this.props.id))
  },

  render: function() {
    if (this.state.complete == 'True') {
      var buttonText = 'Completed',
          butttonColor = "#f9f9f9",
          textColor = "#b3b3b3"
    }
    else if (this.state.complete == 'False'){
      var buttonText = 'Mark Complete',
          butttonColor = "#42f47d",
          textColor = "#666666"
    }
    var buttonStyle = {
        backgroundColor: "#f9f9f9",
        color: "#666666",
        fontSize: "12",
        padding: "8px 12px 8px 12px",
    }
    var goalStyle = {
      fontFamily: "Josefin Sans",
    }
    return (
      <div style={goalStyle} className="life_goal">
        <h2 className="goal_name">{this.props.name}</h2>
        <h4>{this.props.days} days are left</h4>
        <p>{this.state.text}<a onClick={this.handleMore}>{this.state.more}</a></p>
        <ButtonGroup bsSize="xsmall">
          <Button style={buttonStyle} onClick={this.handleComplete}>{buttonText}</Button>
          <Button style={buttonStyle} onClick={this.props.onDelete}>Delete</Button>
          <Button style={buttonStyle} onClick={this.handleUpdate}>Update</Button>
        </ButtonGroup>
      </div>
    );
  }
});

