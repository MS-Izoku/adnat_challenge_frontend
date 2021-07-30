import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class LoginForm extends Component{
    constructor(){
        super();
        this.state={
            email: "",
            password: "",
        }
    }

    handleChange = (e) =>{
        this.setState({ [e.target.name]: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.setUserData(this.state)
    }
    render(){
        return <div style={{background: "blue"}}>
        <h2>Log In</h2>
        <form onSubmit={this.handleSubmit}>
            <label htmlFor="email">Email: </label>
            <input type="text" value={this.state.email} name="email" onChange={this.handleChange}/>

            <label htmlFor="password">Password:</label>
            <input type="password" name="password" value={this.state.password} onChange={ (e)=>this.handleChange(e) } />

            <input type="submit" />
        </form>
        <Link to="/signup">Sign Up</Link>
        <Link to="/password-recovery">Forgot Password</Link>
        </div>
    }
}