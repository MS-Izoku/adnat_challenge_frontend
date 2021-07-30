import React , {useEffect, useState} from 'react'
import _ from 'lodash'
import NewOrganizationForm from './NewOrganizationForm'

const OrganizationList = props => {
    let { organizations=[] } = props
    const [editMode , toggleEditMode] = useState(false)
    const [myOrg , setMyOrg] = useState({})
  
    const renderOrgs = () => {
      return !_.isEmpty(organizations) ? 
      organizations.map((org , key) => <li key={key}>{org.name}
        <button onClick={()=> {props.joinOrg(org)}}>Join</button>
        <button onClick={(()=>{
          
          setMyOrg(org)
          if(org !== myOrg){
            
            toggleEditMode(!editMode)
          }
          toggleEditMode(true)
        })}>Edit</button>
      </li>) : 
      <li>No Companies Found</li>}

    return <>
      <h2>Organizations</h2>
      <ul>
        {renderOrgs()}
      </ul>
      {editMode ? <>
        <NewOrganizationForm
          user={props.user}
          org={myOrg}
          updateOrganization={props.updateOrganization}
          setUserOrg={props.setUserOrg}
          />
      </> : ""}
    </>

}
export default OrganizationList