import React from 'react'
import { BiHomeAlt2 } from 'react-icons/bi'
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import './Navbar.css'
import logo from '../Assets/logo.png'


const Navbar = ({ decodedToken }) => {

  const handleLogout = () => {
    sessionStorage.removeItem('userTokens');
  };

  const routes = [
    {
      title: "Home",
      href: "/home",
      onclick: ()=> window.location.reload(false),
      Icon: BiHomeAlt2,
    },
    {
      title: "Profile",
      href: "/profile",
      Icon: CgProfile,
    },
    {
      title: "Logout",
      href: "/",
      Icon: IoLogOutOutline,
      onclick: handleLogout,
    },
  ];
  
  return (
    <nav className="navbar">
      <a href="/home" className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </a>
      
      <ul className="options">
        <p className="username"> Logged in as {decodedToken.username}</p>
        {routes.map((route) => {
        const { Icon, href, title, onclick } = route;
        return (
          <li key={title}>
            {onclick ? (
              <a href={href} onClick={onclick} className="optionsItems">
                <Icon />
                {title}
              </a>
            ) : (
              <a href={href} className="optionsItems">
                <Icon />
                {title}
              </a>
            )}
          </li>
        );
      })}
      </ul>
    </nav>
  );
}

export default Navbar;
