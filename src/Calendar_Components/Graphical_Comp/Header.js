import React, {Component} from "react";
import axios from "axios";
import {Switch} from "pretty-checkbox-react";
import jwtDecode from "jwt-decode";

const getAllCal_uri = "/user_cal"
const insertCal_uri = "/insert_cal"

class Header extends Component{

    constructor(props) {
        super(props);
        this.state = {
            posts : [],
            params: [],
        }
        this.get_calendar_names_uri = this.props.uri + getAllCal_uri;
        this.createCal_URL = this.props.uri + insertCal_uri
    }

    componentDidMount(){
        this.callServer();
    }

    callServer() {
        let payload = { id: jwtDecode(sessionStorage.getItem('token')).id, username: jwtDecode(sessionStorage.getItem('token')).username};
        axios.post(this.get_calendar_names_uri, payload)
            .then(response => {
                this.setState({posts: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render(){
        const {posts} = this.state;
        const handleChange = (event) =>{
            if(!(this.state.params.find(element => element === event.target.id.toString()))) {
                this.setState(state => ({
                    params : [...state.params, event.target.id.toString()]
                }))
            }
            else {
                let temp = [], j=0
                for(let i=0; i<this.state.params.length; i++)
                    if(!(this.state.params[i] === event.target.id.toString()))
                        temp[j++]= this.state.params[i]
                this.setState(() => ({
                    params : temp
                }))

            }
        }

        const handleSend = () => {
            this.props.handler(this.state.params)
        }



        const handleAddCal = () => {
            let calendarName = prompt("Nome del calendario").toUpperCase()
            let xor = prompt("Calendario esclusivo?", "No")
            const temp = {
                "type": calendarName,
                "xor": (!(xor==="No")).toString(),
                "owner": jwtDecode(sessionStorage.getItem('token')).id
            }
            let payload = JSON.stringify(temp)
            axios.post(this.createCal_URL, payload)
                .then(response => {
                    alert(response.data)
                    window.location.reload()
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        const handleAddPre= () => {
            this.props.handlerPre(false)
        }

        const handleAddUserGroup = () => {
            this.props.handlerUG(false)
        }

        const handleAddAut = () => {
            this.props.handlerAuth(false)

        }


        return (
            <>
                {
                    posts.map((item, index) => {
                        return(
                            <Switch key= {index} id={item.id} value={item.value} onChange={handleChange}>
                                {item.type}
                            </Switch>
                        )
                    })
                }
                <input type="submit" value="Aggiorna la vista" onClick={handleSend} />

                    <p align="center">
                        <input type="submit" value="Aggiungi un calendario" onClick={handleAddCal} />
                        &nbsp;&nbsp;&nbsp;&nbsp;

                        <input type="submit" value="Gestisci utenti e gruppi" onClick={handleAddUserGroup} />
                        &nbsp;&nbsp;&nbsp;&nbsp;

                        <input type="submit" value="Aggiungi precondizione temporale" onClick={handleAddPre} />
                        &nbsp;&nbsp;&nbsp;&nbsp;

                        <input type="submit" value="Aggiungi autorizzazione" onClick={handleAddAut} />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </p>


            </>
        )
    }
}
export default Header
