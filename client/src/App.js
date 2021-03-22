import React, { useEffect, useState } from 'react';
import {GoogleLogin} from 'react-google-login';
import axios from 'axios';
import './app.scss';
import dotenv from "dotenv";



export default function App(){

    const [user, setUser] = useState();

    useEffect(()=>{
        dotenv.config();
    },[]);

    function logOut(){
        setUser();
    }

    const googleSuccess = async(res)=>{
        //const result = res?.profileObj;
        const token = res?.tokenId;
        //console.log(result, token);
        const getUser= await axios.post("http://localhost:3100/signin",{token});
        console.log(getUser.data.user);
        setUser(getUser.data.user);

    }

    const googleFailure = (error) =>{
        console.log("Google Login Failed", error);
    }
    const googleSuccessSignUp = async(res)=>{
        const result = res?.profileObj;
        //console.log(result);
        const data = {
            name:result.name,
            email:result.email
            
        }
        const logData={
            name:result.name,
            email:result.email,
            picture:result.picture
        }
        console.log(data);
        const signUp = await axios.post("http://localhost:3100/signup", data);
        //console.log(signUp);
        setUser(logData);
    }

return(
    
    <div className="main-screen">
        {!user && <div className="signing">
            <GoogleLogin
                clientId="you google client ID"

                buttonText="Sign In"
                onSuccess={googleSuccess}
                onFailure={googleFailure}
                cookiePolicy={'single_host_origin'}
                />    
                OR
                <GoogleLogin
                clientId="you google client ID"

                buttonText="Sign Up"
                onSuccess={googleSuccessSignUp}
                onFailure={googleFailure}
                cookiePolicy={'single_host_origin'}
                />
        </div>}
        {user? <div className="user">Hi!! {user.name}<img src={user.picture} alt="profile"/><button onClick={logOut}>Log Out</button></div>:<h1>you are not logged in</h1>}
    </div>
    )
}