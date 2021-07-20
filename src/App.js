import React from "react";
import CalendarPopup from "./Calendar_Components/CalendarPopup";
import Login from "./Auth_Components/Login"
import Register from "./Auth_Components/Register"
import Change from "./Auth_Components/ChangePwd"

import { BrowserRouter, Route, Redirect} from 'react-router-dom';

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
                    <center>Calendario AM - SS</center>
                    <button type="submit" className="btn btn-primary btn-block" onClick={this.handleLogOut}>Log out</button>
                </h2>
                <BrowserRouter>
                    <Route exact path="/">
                        {this.state.authenticated ?
                            <CalendarPopup auth={this.state.authenticated}/>
                            :
                            <Redirect to="/login" />
                        }
                    </Route>

                    <Route exact path="/login" render={() => (
                        <Login
                            auth={this.handleUpdate}
                            />
                        )}/>
                </BrowserRouter>

            </div>
        )
    }
}
export default App;
