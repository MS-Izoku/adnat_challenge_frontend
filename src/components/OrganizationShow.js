import React, { useState } from 'react'
import ShiftSchedule from './components/ShiftSchedule'

const OrganizationShow = (props) => {
    const [shifts, setShifts] = props
    const [viewShifts , setViewShifts] = useState(false)
    
    return <>
    <h2>{props.organization.name}</h2>
    <button onClick={()=>{setViewShifts(!viewShifts)}}>View Shifts</button>
        <ShiftSchedule shifts={shifts} setShifts={setShifts}/>
    </>
}

export default OrganizationShow