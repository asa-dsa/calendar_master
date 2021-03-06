import React from "react";
import {Redirect} from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";

const loginURL = "http://192.168.188.79:12345/insert_user"
export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            authenticated: false,
            register: false,
            error: false
        }
    }


    insertUser() {
        let payload = { _id: jwtDecode(sessionStorage.getItem('token')).id, username: jwtDecode(sessionStorage.getItem('token')).username};
        axios.post(loginURL, payload)
            .then(response => {
                console.log(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {

        const handleSend = async () => {

            const username = this.state.name
            const password = this.state.pwd

            const result = await fetch(this.props.uri + '/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                username, password
                })
            }).then((res) => res.json())


            if (result.status === 'ok') {
                console.log('Got the token: ', result.data)
                sessionStorage.setItem('token', result.data)
                alert('Login completato con successo\nBenvenuto ' + username + "!")
                this.props.auth(username)
                this.setState({authenticated: true})
                this.insertUser()
            } else {
                alert(result.error)
            }

        }



        const handleRegister = () =>{
            this.setState({register: true})
        }

        const setPwd = (e) => {
            this.setState({pwd: e.target.value})
        }

        const setName = (e) => {
            this.setState({name: e.target.value})
        }

    return(
            <div style={{width:"500px", justifyContent:"center", textAlign:"center"}}>

                {(this.state.authenticated) ?
                    <Redirect to="/" />
                    :
                    <form>
                        <h3>Accesso</h3>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="email" className="form-control" onChange={setName} placeholder="Inserisci il nickname" />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" onChange={setPwd} placeholder="Inserisci la password" />
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;

                        <p>
                        <button type="submit" className="btn btn-primary btn-block" onClick={handleSend}>Accedi</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {(this.state.register) ?
                            <Redirect to="/register" />
                            :
                            <button type="submit" className="btn btn-primary btn-block" onClick={handleRegister}>Registrati</button>
                        }    &nbsp;&nbsp;&nbsp;&nbsp;
                        </p>

                    </form>
                }
            </div>
        )
    }
}

export default Login;