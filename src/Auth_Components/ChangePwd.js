import React from "react";
import {Redirect} from "react-router-dom";


export class ChangePwd extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            redirect: false
        }
    }



    render() {

        const setPwd = (e) => {
            this.setState({pwd: e.target.value})
        }

        const setDoublePwd = (e) => {
            this.setState({temp_pwd: e.target.value})
        }

        const onSend = async () => {
            if (this.state.temp_pwd !== this.state.pwd) {
                alert("Password non corrispondenti")
            } else {
                const password = this.state.pwd

                const result = await fetch('http://192.168.188.77:9999/api/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        newpassword: password,
                        token: localStorage.getItem('token')
                    })
                }).then((res) => res.json())

                if (result.status === 'ok') {
                    // everythign went fine
                    alert('Success')
                    localStorage.removeItem('token')
                } else {
                    alert(result.error)
                }



            }

        }


        return(
            <div style={{width:"500px", justifyContent:"center", textAlign:"center"}}>
                <form>
                    <h3>Registrazione</h3>


                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Inserisci la password" onChange={setPwd}/>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Re-inserisci la password" onChange={setDoublePwd}/>
                    </div>

                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {(this.state.redirect) ?
                        <Redirect to="/login" />
                        :
                        <p><button type="submit" className="btn btn-primary btn-block" onClick={onSend}>Cambia password</button></p>
                    }


                </form>
            </div>
        )
    }
}

export default ChangePwd;