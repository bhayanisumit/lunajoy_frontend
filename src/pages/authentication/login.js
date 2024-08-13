import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Correct import
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;
  
 
    const authentication = () => {
      
      axios
        .post(
          `${url}/patient/new-patient`,
          {
            email,
            name,
            picture,
          },
          {
            headers: { "Content-Type": "application/json" }
          }
        )
        .then((response) => {
          
          if (response.data.status === 200 || response.data.status === 201) {
            toast.success("Logged in successfully");
            setTimeout(() => navigate("/dashboard"), 2000);
          }
        })
        .catch((error) => {
          console.error(
            "Error during request:",
            error.response?.data || error.message
          );
        });
    };
 

 

  useEffect(() => {
    if (token) {
      
      try {
        const decoded = jwtDecode(token);

        // Check if the fields are nested or have different names
        const email1 = decoded?.email || decoded?.profile?.email || "";
        const name1 = decoded?.name || decoded?.profile?.name || "";
        const picture1 = decoded?.picture || decoded?.profile?.picture || "";
        

        setEmail(email1);
        setName(name1);
        setPicture(picture1);
       
        
        if(name && email && picture ){
          authentication();
        }
        
      } catch (error) {
        console.error("Failed to decode token:", error);
      }

      // console.log(email,name,picture)
    }
  }, [token ,name ,email,picture]);



  return (
    <>
    <ToastContainer />
      <div className="container login-container">
        <div className="row">
          <div className="col-md-4 offset-4">
            <div className="card login-card">
              <h3>Login</h3>
              <div className="card-body">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                      if(credentialResponse.credential)   {

                        localStorage.setItem("auth", credentialResponse.credential);
                      }
                    setToken(credentialResponse.credential);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
