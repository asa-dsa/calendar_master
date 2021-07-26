import React, {Component} from "react";
import axios from "axios";



const insertGroup_uri = "/insert_group"
const getGroup_uri = "/list_created_group"
const insertUserGruop = "/insert_user_group"

class UserGroup extends Component{



    constructor(props) {
        super(props);
        this.state = {
            group : [],
        }
        this.insertGroup = this.props.uri + insertGroup_uri;
        this.insertedGroup = this.props.uri + getGroup_uri;
        this.insertUserinGroup = this.props.uri + insertUserGruop;

    }

    componentDidMount() {
        this.getGroup()
    }

    handleAddGroup = () =>{
        let groupName = prompt("Inserisci il nome del gruppo da creare")
        const temp = {
            "name": groupName,
            "creator": this.props.user
        }
        let payload = JSON.stringify(temp)
        axios.post(this.insertGroup, payload)
            .then(response => {
               alert(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleAddUser = () =>{
        for(let i =0 ; i<this.state.group.length; i++){
            console.log(i)
            console.log(this.state.group[i].name)
        }
        let group = prompt("Inserisci numero del gruppo")
        let user = prompt("Inserisci il nome dell'utente")
        const id_group = (JSON.stringify(this.state.group[group]._id))
        const a = id_group.replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
        console.log(a)
        const temp = {
            "id": this.props.user,
            "user": user,
            "group": a.toString()
        }
        const payload = JSON.stringify(temp)
        console.log(payload)

        axios.post(this.insertUserinGroup, payload)
            .then(response => {
                alert(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    getGroup = () =>{
        let payload = { id: this.props.user};
        axios.post(this.insertedGroup, payload)
            .then(response => {
                this.setState({group: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    backToCal = () =>{
        this.props.handlerViews(true)

    }


    render(){
        return(
            <div>
                Hi, I'm the USerGroup class
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Aggiungi un gruppo" onClick={this.handleAddGroup} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Aggiungi utente al gruppo" onClick={this.handleAddUser} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Torna indietro" onClick={this.backToCal} />

                </p>
            </div>
        )

    }

}

export default UserGroup;