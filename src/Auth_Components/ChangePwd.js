import React from "react";
import {Redirect} from "react-router-dom";


export class ChangePwd extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            error: false,
            redirect: false
        }
    }



    render() {

        const updatepwd = (e) => {
            this.setState({pwd: e.target.value})
        }

        const reupdatepwd = (e) => {
            this.setState({other_pwd: e.target.value})
        }

        const onSend = () =>{

            if(this.state.other_pwd !== this.state.pwd) {
                alert("Password non corrispondenti")
                this.setState({error: true})
            }
        }

        const handleReset = () => {
            this.setState({redirect: true})
        }

        return(
            <div style={{width:"500px", justifyContent:"center", textAlign:"center"}}>
                <form>
                    <h3>Cambio Password</h3>

                    <div className="form-group">
                        <label>Indirizzo mail</label>
                        <input type="email" className="form-control" placeholder="Inserisci indirizzo email" />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Inserisci la password" onChange={updatepwd}/>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Re-inserisci la password" onChange={reupdatepwd}/>
                    </div>

                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <p>
                        <button type="submit" className="btn btn-primary btn-block" onClick={onSend}>Cambia la password</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </p>
                    {(this.state.redirect) ? <Redirect to="/login" />
                        :
                        <p><button type="submit" className="btn btn-primary btn-block" onClick={handleReset}>Torna al login</button></p>
                    }


                </form>
            </div>
        )
    }
}

export default ChangePwd;