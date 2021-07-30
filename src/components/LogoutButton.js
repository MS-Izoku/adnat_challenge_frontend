import React from 'react'

const LogoutButton = (props) =>{
    return <button onClick={props.logout ? props.logout :
     ()=>
     {localStorage.removeItem("token")}
        }>
        Logout
     </button>
}

export default LogoutButton