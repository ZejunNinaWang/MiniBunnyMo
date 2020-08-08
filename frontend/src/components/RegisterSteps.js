import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function RegisterSteps(props) {
  const userRegister = useSelector(state => state.userSignin);
  const {loading, userInfo, error} = userRegister;

  return <div style={{display: userInfo&&userInfo.avatar? 'none':''}} className="register-steps">
    <div className={props.step1 ? 'active' : ''}>Register</div>
    <div className={props.step2 ? 'active' : ''}>Add Avatar</div>
    </div>
}

export default RegisterSteps;