import React, { useState } from "react"
import "./Login.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";


import user_icon from "../Assets/person.png"
import email_icon from "../Assets/email.png"
import password_icon from "../Assets/password.png"
const SERVER_URL = 'http://localhost:3000';


const Login = () => {
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const addUser = async (name, email, password) => {
                try {
                    const user = {
                        name: name,
                        email: email,
                        password: password,
                        accountType: "user"
                    };
            
                    const response = await axios.post(`${SERVER_URL}/users/signup`, user);
                    console.log(response.data);
                } catch (error) {
                    console.error('Eroare la înregistrare:', error.response ? error.response.data : error.message);
                }
            };
            
        console.log("LoginSignup component rendered");

        const navigate = useNavigate();

        const handleSignUpClick = () => {
                if (action === "Login") {
                    setAction("Sign Up");
                } else {
                        if (!email.endsWith('@stud.ase.ro')) {
                                alert('Eroare la înregistrare: Adresa de email trebuie să fie de tipul stud.ase.ro');
                                return;}
                              else{
                        addUser(name, email, password);
                    navigate("/home");}
                }
        }

        const handleLoginClick = async () => {
                if (action === "Sign Up") {
                  setAction("Login");
                } else {
                  try {
                    const response = await axios.post(`${SERVER_URL}/users/login`, {
                      email: email,
                      password: password,
                    });
              
                    const user = response.data;
                    
                    
                      navigate("/home");
                    }
                   catch (error) {
                    alert('Eroare la autentificare: Adresa de email nu există sau alte probleme');
                  }
                }
              };
              
          
          
        const [action,setAction] = useState("Login");

    return (
        <form>
        <div className="container">
                <div className="header">
                        <div className="text">{action}</div>
                        <div className="underline"></div>
                </div>
                <div className="inputs">
                        {action ==="Login"?"":<div className="input" >
                                <img src={user_icon} alt="" />
                                <input type="text" placeholder="Name" value={name} onChange= { (e)=> setName(e.target.value)}/>
                        </div>}
                        
                        <div className="input" >
                                <img src={email_icon} alt="" />
                                <input type="text" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
                        </div>
                        <div className="input">
                                <img src={password_icon} alt="" />
                                <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                        </div>
                </div>
                {action ==="Sign Up"?<div></div>:<div className="forgot-password">Forgot your password? <span>Click here!</span></div>}
                <div className="submit-container">
                        <div className={action ==="Login"?"submit gray":"submit"}
                         onClick={handleSignUpClick}>Sign Up</div>
                        <div className={action ==="Sign Up"?"submit gray":"submit"}
                        onClick={handleLoginClick}>Login</div>
                </div>
        </div>
        </form>
    )
}

export default Login