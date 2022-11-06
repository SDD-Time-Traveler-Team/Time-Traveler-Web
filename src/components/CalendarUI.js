import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import CalendarViewUI from "./CalendarViewUI";
import NavBar from './NavBar';
import Authentication from "../api/Authentication";

const CalendarUI = () => {
    const [auth] = useState(new Authentication());
    const [loggedIn, setLoggedIn] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedIn(!!auth.user);

        // if signed out, redirect to /login
        if (!loggedIn) {
            navigate("/login");
            console.log("not logged in, redirect to /login");
            console.log(auth.user);
        }
    }, [auth.user, loggedIn, navigate]);

    return (
        <>
        <NavBar setLoginStatus={setLoggedIn}/>
            <CalendarViewUI/>
        </>
    );
}

export default CalendarUI;
