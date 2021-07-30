import React, {useState, useEffect} from 'react'
import './App.css';
import {BrowserRouter as Router, Link} from 'react-router-dom'
import _ from 'lodash'

import LoginForm from './components/LoginForm'
import UserShow from './components/UserShow';
import LogoutButton from './components/LogoutButton';
import SignupForm from './components/SignupForm';

export const token = localStorage.getItem("token")

function App() {
  const [user , setUserData] = useState({})
  const [organizations = [] , setOrganizations] = useState([])
  const [userOrg , setUserOrg] = useState()
  const [shifts , setShifts] = useState([])

  const login = (userData) => {
    const {email , password} = userData
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        user: {
          email,
          password: password
        }
      })
    })
      .then(r => r.json())
      .then(json =>{
        // give the JWT Token to LocalStorage
        
        localStorage.setItem("token" , json.token)
        setUserData(json.user)
    })
  }

  const logout = () =>{
    localStorage.removeItem("token")
    setUserData({})
  }

  const fetchOrganizations = () =>{
    fetch("http://localhost:3000/organizations/", {
      method: 'GET',
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.token}`
      }
    })
    .then(resp => resp.json())
    .then(json => {
      setOrganizations(json)
    })
  }

  const addOrganization = (newOrg) => {
    setOrganizations([...organizations , newOrg])
  }

  const updateOrganization = orgData => {
    const myOrgs = organizations.filter((org)=>org.id !== orgData.id)
    const newOrgs = [...myOrgs , orgData].sort((orgA , orgB) => orgA.id - orgB.id)
    setOrganizations(newOrgs)    
  }

  const destroyOrganization = orgData => {
    const myOrgs = organizations.filter((org)=>org.id !== orgData.id)
    fetch('http://localhost:3000/organizations/' + orgData.id , {
      method: "DELETE",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        organization:{
          id: orgData.id
        }
      })
    })
    .then(resp => resp.json())
    .then(json => {      
      setOrganizations(myOrgs)
      leaveOrg()
    })
  }

  const deleteMyAccount = () =>{
    if(!user) return
    
    fetch(`http://localhost:3000/users/${user.id}/`, {
        method: "DELETE",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ user: {
          id: user.id,
        }
      })
    })
    .then(resp => resp.json())
    .then(json => {
      console.log("Fine then, I guess I'm too good for this site after all!")
      //localStorage.removeItem("token")
      logout() 
    })
  }

  const leaveOrg = () =>{
    if(!user) return
    // I kept this one in because I thought it'd give you a laugh
    console.log("Fine, I'll just leave then!")
    fetch(`http://localhost:3000/quit/${user.id}/` , {
      method: "PATCH",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        user: user
      })
    })
    .then(resp => resp.json())
    .then(json => {
      setUserOrg(json.organization)
      setUserData(json.userData)
    })
  }

  const joinOrg = (org) =>{
    if(!user) return
    // patch the user to asscociate them on the backend
    fetch(`http://localhost:3000/join/${user.id}/${org.id}/` , {
      method: "PATCH",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        user: user
      })
    })
    .then(resp => resp.json())
    .then(json => {
      setUserOrg(json.organization)
      setUserData(json.userData)
    })
  }

  useEffect(()=>{
    // Auto Login when a Token is present
    if(localStorage.token && _.isEmpty(user)){
      fetch('http://localhost:3000/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
        }
      })
        .then(r => r.json())
        .then(json =>{        
          // JWT already exists, just set the userData
          setUserData(json.user)
          setUserOrg(json.organization)          
      })      
    }

    fetchOrganizations()
  }
  ,[user])
  
  return (
    <Router>
      <h1><Link to="/">Adnat</Link></h1>
      {
        _.isEmpty(user) ? <>
        <LoginForm setUserData={login}/>
        <SignupForm setUserData={setUserData}/>
        </> : <>
        <UserShow
            user={user}
            userOrg={userOrg}
            setUserOrg={setUserOrg}
            leaveOrg={leaveOrg}
            organizations={organizations} 
            setOrganizations={setOrganizations} 
            fetchOrganizations={fetchOrganizations}
            addOrganization={addOrganization}
            shifts={shifts}
            setShifts={setShifts}
            updateOrganization={updateOrganization}
            joinOrg={joinOrg}
            destroyOrganization={destroyOrganization}
            deleteMyAccount={deleteMyAccount}
        />

        </>
        
      }
      <LogoutButton logout={logout} />
    </Router>
  );
}

export default App;
