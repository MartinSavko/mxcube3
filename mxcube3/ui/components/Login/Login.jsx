'use strict';
import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react'
import { Redirect, Router, Route } from 'react-router';
import classNames from 'classnames';
import "bootstrap-webpack!bootstrap-webpack/bootstrap.config.js";
import { Input, ButtonInput, Form, Well } from "react-bootstrap";
import './Login.css';
import {reduxForm} from 'redux-form';
import { ErrorNotificationPanel } from '../Logging'

class Login extends React.Component {
  constructor(props) {
      super(props)
      this.state = { show_loader: false }
  }

  componentWillMount(){
    this.props.getLoginInfo();  
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.status.code === "ok"){
      window.location.assign("#/");    
    }
  }
  
  signIn(){
      let fields = this.props.fields;
      this.props.signIn(fields.username.value, fields.password.value);
      this.setState({ show_loader: true });
  }

  render() {
      const {fields: {username, password}} = this.props;
      let loginInfo = this.props.loginInfo;

      return (
          <div>
          <ErrorNotificationPanel/>
          <div className="row row-centered">
          <div>
           <img src="../../img/mxcube_logo20.png" className="img-logo"/>
          </div>
          <h3 >Welcome to {loginInfo.beamline_name} at {loginInfo.synchrotron_name}</h3>
          <div className="col-md-5 col-centered">
          <div className="well well-left h5">
             <div>
                <form className="form from-actions" bsStyle="inline" >
                  <Input  label="LoginID" ref="proposal" type="text" name="proposal" placeholder={loginInfo.loginType} {...username} required autofocus/>{' '}
                  <Input  label="Password"  ref="password" type="password" name="password" placeholder="Password" {...password} required onKeyPress={(target) => { if (target.charCode==13) { this.signIn() }}}/>{' '}
                  <ButtonInput id="submit" bsStyle="primary"  value="Sign in"  onClick={() => this.signIn()}/>
                </form>
              </div>
             </div>
             <div className={this.state.show_loader ? "" : "hidden"}>
               <img src="../../img/loader.gif" className="img-responsive"/>
             </div>
            </div>
            </div>
          </div>
          );
  }
}


Login = reduxForm({ // <----- THIS IS THE IMPORTANT PART!
  form: 'loginForm',                           // a unique name for this form
  fields: ['username', 'password'] // all the fields in your form
})(Login);

export default Login;