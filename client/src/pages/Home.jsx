import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate=useNavigate()
  const handleClick=()=>{
    navigate('/rendezvous')
  }
  
  
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Bienvenue chez Mediturn</h1>
        <p>Réservez facilement votre consultation en ligne</p>
        <button onClick={()=>handleClick()} className="rendezvous-button">Prenez un rendez-vous</button>
      </div>
    </div>
  )
}

export default Home
