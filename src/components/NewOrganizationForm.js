import React, {Component} from "react"

export default class NewOrganizationForm extends Component{
    constructor(){
        super()
        this.state={
            name: "",
            hourly: 0.0
        }
    }

    componentDidMount(){
        if(this.props.org)
            this.setState({name: this.props.org.name , hourly: this.props.org.hourly})
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit = (e) =>{
        e.preventDefault()

        fetch("http://localhost:3000/organizations/" + (this.props.org ? this.props.org.id: "") + "/", {
            method: this.props.org ? "PATCH" : "POST",
            headers:{
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                organization:{
                    name: this.state.name,
                    hourly: this.state.hourly
                }
            })
        })
        .then(resp => resp.json())
        .then(json => {
            if(!json.error){
                if(!this.props.org)
                    this.props.addOrganization(json)
                else{
                    this.props.updateOrganization(json)
                    if(json.id === this.props.user.organization_id){
                        this.props.setUserOrg(json)
                    }
            }
            }
                
        })
    }

    render(){
        return<>
        <h2>{!this.props.org ? "Create" : "Edit" } Organization</h2>
        <form onSubmit={this.onSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" value={this.state.name} onChange={this.handleChange} name="name" />
            <label htmlFor="hourly">Hourly Rate: $</label>
            <input type="text" value={this.state.hourly} onChange={this.handleChange} name="hourly" />
            <input type="submit" />
        </form>
        </>
    }
}