import React from "react";
import {Redirect} from "react-router-dom";


export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            redirect_pwd : false,
            authenticated: false
        }
        this.props.auth("logged")

    }



    render() {

        const handleSend = async () => {
            const username = this.state.name
            const password = this.state.pwd

            const result = await fetch('http://192.168.188.77:9999/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                username, password
                })
            }).then((res) => res.json())

            if (result.status === 'ok') {
                // everythign went fine
                console.log('Got the token: ', result.data)
                localStorage.setItem('token', result.data)
                alert('Login completato con successo\nBenvenuto ' + username + "!")
            } else {
                alert(result.error)
            }

            this.props.auth(username)
            this.setState({authenticated: true})

        }

        const handleReset = () => {
            this.setState({redirect_pwd: true})

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
                            <label>Indirizzo mail</label>
                            <input type="email" className="form-control" onChange={setName} placeholder="Inserisci indirizzo email" />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" onChange={setPwd} placeholder="Inserisci la password" />
                        </div>
                        &nbsp;&nbsp;&nbsp;&nbsp;

                        <p>
                        <button type="submit" className="btn btn-primary btn-block" onClick={handleSend}>Accedi</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button type="submit" className="btn btn-primary btn-block">Registrati</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        </p>
                        {(this.state.redirect) ?
                            <Redirect to="/changepwd" />
                        :
                            <p><button type="submit" className="btn btn-primary btn-block" onClick={handleReset}>Password dimenticata?</button></p>
                        }
                    </form>
                }
            </div>
        )
    }
}

export default Login;