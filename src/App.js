import React from "react";
import CalendarPopup from "./Calendar_Components/CalendarPopup";
import Login from "./Auth_Components/Login"
import Register from "./Auth_Components/Register"

import { BrowserRouter, Route, Redirect} from 'react-router-dom';


const authServerUri = 'http://192.168.188.77:9999'


export class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: !(localStorage.getItem('token') === null)
        }
        this.handleUpdate = this.handleUpdate.bind(this)
    }

    handleUpdate = (data) =>{
        this.setState({authenticated: true})
        this.setState({user: data})
    }

    handleLogOut = () =>  {
        localStorage.removeItem('token');
        window.location.reload();
    }

    render() {
        console.log(localStorage.getItem("token"))
        return (
            <div className="App">
                <h2>
                    <center>Calendario AM - SS </center></h2>
                    {(this.state.authenticated) ?
                        <center> <button type="submit" className="btn btn-primary btn-block" onClick={this.handleLogOut}>Log
                            out</button>
                        </center>
                    :
                        <p></p>
                    }

                <BrowserRouter>
                    <Route exact path="/">
                        {this.state.authenticated ?
                            <CalendarPopup auth={this.state.authenticated} username={this.state.user}/>
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
