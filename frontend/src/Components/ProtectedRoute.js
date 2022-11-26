import React from "react";
import { Navigate, Route, Outlet } from "react-router-dom";


const ProtectedRoute = ({component: Component, authed, ...rest}) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (isAuthenticated === 'true') {
        return (<Outlet />)
    } else {
        return <Navigate to="/login" />;
    }

}

export default ProtectedRoute;
