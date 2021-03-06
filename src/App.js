import React from "react";
import CalendarPopup from "./Calendar_Components/CalendarPopup";
import Login from "./Auth_Components/Login"
import Register from "./Auth_Components/Register"

import { BrowserRouter, Route, Redirect} from 'react-router-dom';
import jwtDecode from "jwt-decode";


const authServerUri = 'http://192.168.188.77:9999'


export class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: !(sessionStorage.getItem('token') === null)
        }
        this.handleUpdate = this.handleUpdate.bind(this)
    }

    handleUpdate = (data) =>{
        this.setState({authenticated: true})
    }

    handleLogOut = () =>  {
        sessionStorage.removeItem('token');
        window.location.reload();
    }

    render() {
        //console.log(sessionStorage.getItem('token'))
        return (
            <div className="App">
                <h2>
                    <center>Calendario AM - SS  </center></h2>
                    {(this.state.authenticated) ?
                        <p>
                            <center>{jwtDecode(sessionStorage.getItem('token')).username} </center>
                        <center> <button type="submit" className="btn btn-primary btn-block" onClick={this.handleLogOut}>Log
                            out</button>
                        </center>
                            </p>
                    :
                        <p></p>
                    }

                <BrowserRouter>
                    <Route exact path="/">
                        {this.state.authenticated ?
                            <CalendarPopup/>
                            :
                            <Redirect to="/login" />
                        }
                    </Route>

                    <Route exact path="/login" render={() => (
                        <Login
                            auth={this.handleUpdate}
                            uri={authServerUri}
                            />
                        )}/>

                    <Route exact path="/register" render={() => (
                        <Register
                            uri={authServerUri}
                        />
                    )}/>


                </BrowserRouter>

            </div>
        )
    }
}
export default App;
