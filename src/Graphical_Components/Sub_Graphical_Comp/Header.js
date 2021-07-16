import React, {Component} from "react";
import axios from "axios";
import {Switch} from "pretty-checkbox-react";

const getAllCal_uri = "/cal"


class Header extends Component{

    constructor(props) {
        super(props);
        this.state = {
            posts : [],
            params: [],
        }
        this.get_calendar_names_uri = this.props.uri + getAllCal_uri;

    }

    componentDidMount(){
        this.callServer();
    }

    callServer() {
        axios.get(this.get_calendar_names_uri)
            .then(response => {
                //console.log(response.data)
                this.setState({posts: response.data});
            })
            .catch(error =>{
                console.log(error);
                this.setState({error: 'Error'});
            })
    }


    render(){

        let cal = []
        const {posts} = this.state;
        if(this.state.posts.length){
            posts.map((post, index) =>{
                cal[index] = post.Type
            })
        }

        const handleChange = (event) =>{
            if(!(this.state.params.find(element => element === event.target.value.toString()))) {
                this.setState(state => ({
                    params : [...state.params, event.target.value.toString()]
                }))
            }
            else {
                let temp = [], j=0
                for(let i=0; i<this.state.params.length; i++)
                    if(!(this.state.params[i] === event.target.value.toString()))
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
           let calendarName = prompt("Nome del calendario")
            console.log(calendarName)
            console.log(this.props.owner)
        }

        const handleAddPre= () => {
        }

        const handleAddAut = () => {
        }


        return (
            <>
                {
                    cal.map((item, index) => {
                        return(
                            <Switch key= {index} id={index} value={item} onChange={handleChange}>
                                {item}
                            </Switch>
                        )
                    })
                }
                <input type="submit" value="Aggiorna la vista" onClick={handleSend} />
                {(this.props.owner === "UserTest")?
                    <p align="center">
                        <input type="submit" value="Aggiungi un calendario" onClick={handleAddCal} />
                        <input type="submit" value="Aggiungi precondizione temporale" onClick={handleAddPre} />
                        <input type="submit" value="Aggiungi autorizzazione" onClick={handleAddAut} />
                    </p>
                    :
                    <p></p>
                }
            </>
        )
    }
}
export default Header
