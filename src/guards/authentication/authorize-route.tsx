import React from "react";
import {Navigate} from "react-router-dom";

class AuthorizeRoute extends React.Component<{ isAuthenticated: any, children: any }> {
    render() {
        let {isAuthenticated, children} = this.props;
        return isAuthenticated ? children : <Navigate to="/"/>;
    }
}

export default AuthorizeRoute;