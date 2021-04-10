import React, { useEffect, useState } from 'react';
import {GoogleLogin} from 'react-google-login';
import axios from 'axios';
import './app.scss';
import {secret_ID, domain} from './utils';
import jwt from 'jsonwebtoken';

export default function App(){

    const [user, setUser] = useState();
    
    useEffect(()=>{
        checkForKey();
    },[])

    async function checkForKey(){
        const oldKey = localStorage.getItem('auth_token');
        const userOld = jwt.decode(oldKey)
        if(Date.now() > userOld.exp){
            const loggedInUser = await axios.get(domain+"/user/"+userOld.userId);
            console.log(loggedInUser);
            const {name,email,profilePic} = loggedInUser.data;
            setUser({
                name,
                email,
                profilePic
            }) 

        }

    }

    function logOut(){
        localStorage.removeItem('auth_token');
        setUser();
    }

    const googleSuccess = async(res)=>{
        const token=res.tokenObj.id_token;
        const authAxios = axios.create({
            baseURL:domain+"/user",
            headers:{
                Authorization: token
            }
        }
        )
        const getUser= await authAxios.get("/signin");
        localStorage.setItem('auth_token',getUser.data.authToken);
        console.log(getUser.data.user);
        setUser(getUser.data.user);

    }

    const googleFailure = (error) =>{
        console.log("Google Login Failed", error);
    }

return(
    
    <div className="main-screen">
        {!user && <div className="signing">
            <GoogleLogin
                clientId={secret_ID}

                buttonText="Hop In"
                onSuccess={googleSuccess}
                onFailure={googleFailure}
                cookiePolicy={'single_host_origin'}
                />
        </div>}
        {user? <div className="user">Hi!! {user.name}<img src={user.profilePic} alt="profile"/><button onClick={logOut}>Log Out</button></div>:<h1>you are not logged in</h1>}
    </div>
    )
}