import React, { Component } from 'react'

class NavBar extends Component {
   render(){
    return (
        <>
         <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
          target="_blank"
          rel="noopenr noreferrer">
           Blockchain marketplace
          </a>

  <span className="navbar-text">
    <p>{this.props.account}</p>
  </span>


        </nav>
        </>
    )
   }
}

export default NavBar;