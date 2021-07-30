import React, {Component} from 'react'
import { Link } from 'react-router-dom'

export default class SignupForm extends Component{
    constructor(){
        super()
        this.state={
            name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            error: ""
        }
    }

    handleChange = (e) =>{
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault()

        if(this.state.password !== this.state.passwordConfirmation){
            this.setState({error: "Passwords Do Not Match"})
        }   

        else{
            fetch(`http://localhost:3000/signup` , {
                method: "POST",
                headers:{
                    "Content-Type": 'application/json',
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                    name: this.state.name,
                })
            })
            .then(resp => resp.json())
            .then(json =>{
                this.props.setUserData(json.user)
            })
        }        
    }

    render(){
        return <>
        <h2>Sign Up</h2>
        <form onSubmit={this.handleSubmit}>
            <label htmlFor="name">Name: </label>
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>

            <label htmlFor="email">Email: </label>
            <input type="email" name="email" value={this.state.email} onChange={this.handleChange}/>

            {this.state.password !== this.state.passwordConfirmation ? <span>{this.state.error}</span> : ""}
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>

            <label htmlFor="passwordConfirmation">Password Confirmation:</label>
            <input type="password" name="passwordConfirmation" value={this.state.passwordConfirmation} onChange={this.handleChange}/>

            <input type="submit" />
        </form>
        <Link to="/login">Log In</Link>
        </>
    }
}