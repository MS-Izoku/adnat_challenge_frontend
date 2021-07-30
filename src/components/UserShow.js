import _ from 'lodash'
import React , {useState , useEffect} from 'react'
import NewOrganizationForm from './NewOrganizationForm'
import OrganizationList from './OrganizationsList'
import ShiftSchedule from './ShiftSchedule'

const UserShow = (props) =>{
    const [viewShifts , setViewShifts] = useState(false)

    useEffect(()=>{
      // refresh when organizations change
    },[props.organizations])

    return <>
      <p>
      {props.user.name === "" || props.user === {} ? 
          "Please Log In" :
          <span>You are logged in as: {props.user.name} <a onClick={props.logout}/></span>        
        }
        </p>
  
        {props.userOrg ?
         <>
         <span>You work at {props.userOrg.name}</span>
         <button onClick={props.deleteMyAccount}>Total Account Annihalation (delete account)</button>
         <NewOrganizationForm
          user={props.user}
          addOrganization={props.addOrganization}
          org={props.userOrg} 
          updateOrganization={props.updateOrganization}
          setUserOrg={props.setUserOrg}
          />
          <button onClick={()=>{props.destroyOrganization(props.userOrg)}}>FIRE EVERYONE NOW (delete org)</button>
         <button onClick={setViewShifts}>View Shifts</button>
         <button onClick={props.leaveOrg}>Leave Organization</button>
         
         {viewShifts ? <ShiftSchedule shifts={props.shifts} user={props.user} organizations={props.organizations}/> : null}
         </>:
           <>
            <p>You aren't a member of any organizations.</p>
            <p>Join an existing one or create a new one.</p>
            <OrganizationList 
              organizations={props.organizations}
              user={props.user}
              updateOrganization={props.updateOrganization}
              joinOrg={props.joinOrg}
             />
             <NewOrganizationForm addOrganization={props.addOrganization}/>
           </>
        }
       </>
  }

  export default UserShow