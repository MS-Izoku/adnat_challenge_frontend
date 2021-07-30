import React , {useEffect, useState, Component} from 'react'
import token from '../App'
import _ from 'lodash'
import { isCompositeComponentWithType } from 'react-dom/test-utils'

const ShiftSchedule = props => {
    let [shifts , setShifts] = useState([])
    const generateTableRow = (rowData , key) => {
        
        // for later: format the float value of the cost and standarize the time display
        // 00:00 am/pm

        const {name , start , finish} = rowData
        const startDate = new Date(start)
        const endDate = new Date(finish)

        const displayTime = (targetDate) => `${targetDate.getHours()}:${targetDate.getMinutes()}`
        const calcHoursWorked = () => {
            const myTime = endDate.getTime() - startDate.getTime()
            return (myTime / 1000 / 60 / 60) - rowData.break_length
        }

        const calculateCost = calcHoursWorked() * 7.25
        return <tr key={key}>
            <th>{name}</th>
            <th>{startDate.getDate(start)}/{startDate.getMonth(start) + 1}/{startDate.getFullYear(start)}</th>
            <th>{displayTime(startDate)}</th>
            <th>{displayTime(endDate)}</th>
            <th>{rowData.break_length}</th>
            <th>{calcHoursWorked()}</th>
            <th>${calculateCost}</th>
        </tr>
    }

    const genrerateAllRows = () => shifts.map((shift , key) =>{
        return generateTableRow(shift , key)
    })

    useEffect(()=>{
        if(_.isEmpty(props.shifts)){
           
            fetch(`http://localhost:3000/shifts/index/${props.user.organization_id}`,{
                method: "GET",
                headers:{
                    "Content-Type": 'application/json',
                    Accept: "application/json"
                }
            })
            .then(resp => resp.json())
            .then(json => {
                
                setShifts(json)
            })
        }

    },[])
    return <>
        <table>
   <thead>
   <tr>
        <th>Employee Name</th>
        <th>Shift Date</th>
        <th>Start Time</th>
        <th>Finish Time</th>
        <th>Break Length</th>
        <th>Hours Worked</th>
        <th>Shift Cost</th>
        </tr>
   </thead>
   <tbody>
     {genrerateAllRows()}
     
   </tbody>
    </table>
    <ShiftCreatorBar user={props.user} setShifts={setShifts} shifts={shifts}/>
    </>
    
}

class ShiftCreatorBar extends Component{
    constructor(){
        super()
        this.state={
            shiftDate: new Date(),
            startTime: "00:00",
            finishTime: "00:00",
            breakLength: 0,
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = e =>{
        e.preventDefault()

        const {shiftDate , startTime , finishTime , breakLength} = this.state
        // create a UTC time string parsable by the backend
        const createDateTimeString = (date , time) => {
            date = new Date(date)
            const hour = time[0] + time[1]
            const minute = time[3] + time[4]
            const myDate = new Date(date.getFullYear() , date.getMonth() , date.getDate() + 1 , hour, minute , 0 , 0)
            return myDate
        }
        const start = createDateTimeString(shiftDate , startTime)
        const finish = createDateTimeString(shiftDate , finishTime)

        fetch(`http://localhost:3000/shifts/`, {
            method: "POST",
            headers:{
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                shift: {
                    user_id: this.props.user.id,
                    start: start,
                    finish: finish,
                    break_length: this.state.breakLength,
                    
                }
            })        
        })
        .then(resp => resp.json())
        .then(json => {
            this.props.setShifts([...this.props.shifts , json])
        })
    }

    render(){
        return <form onSubmit={this.handleSubmit}>
            <input type="date" name="shiftDate" value={this.state.shiftDate} onChange={this.handleChange} />
            <input type="time" name="startTime" value={this.state.startTime} onChange={this.handleChange} />
            <input type="time" name="finishTime" value={this.state.finishTime} onChange={this.handleChange} />
            <input type="number" name="breakLength" value={this.state.breakLength} onChange={this.handleChange} />
            <input type="submit" />
        </form>
    }
}

export default ShiftSchedule