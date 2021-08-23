import React, {Component, useState} from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";



const insertGroup_uri = "/insert_group"
const getGroup_uri = "/list_created_group"
const insertUserGroup = "/insert_user_group"
const image = "/image"
const addHier = "/add_group_hier"


class UserGroup extends Component{



    constructor(props) {
        super(props);
        this.state = {
            group : [],
            addUser: false,
            showH: false,
            userToAdd:"",
            group_id: "",
            base64: "",
            dad: "ANY",
            imageURL: this.props.uri + image
        }
        this.insertGroup = this.props.uri + insertGroup_uri;
        this.insertedGroup = this.props.uri + getGroup_uri;
        this.insertUserinGroup = this.props.uri + insertUserGroup;
        this.insertHier = this.props.uri + addHier
    }

    componentDidMount() {
        this.getGroup()
    }


    serverConn = (url, payload) =>{
        axios.post(url, payload)
            .then(response => {
                alert(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    handleAddGroup = () =>{
        let groupName = prompt("Inserisci il nome del gruppo da creare")
        const temp = {
            "name": groupName.toUpperCase(),
            "creator": this.props.user
        }
        let payload = JSON.stringify(temp)
        this.serverConn(this.insertGroup, payload)
        this.getGroup()
    }


    handleUserAdd = () =>{
        let a = JSON.stringify(this.state.group_id).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
        const temp = {
            "id": this.props.user,
            "user": this.state.userToAdd,
            "group": a.toString()
        }
        const payload = JSON.stringify(temp)
        this.serverConn(this.insertUserinGroup, payload)
        this.setState({addUser: false})
        this.getGroup()

    }


    handleAddUser = () =>{
        this.setState({addUser: !this.state.addUser})
    }

    handleHier = () => {
        this.setState({showH: !this.state.showH})
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
        window.location.reload()
        this.props.handlerViews(true)

    }

    handleAddHier = () =>{
        if(this.state.son===this.state.dad)
            alert("Errore")
        else {
            const temp = {
                "id": this.props.user,
                "dad": this.state.dad,
                "son": this.state.son
            }
            let payload = JSON.stringify(temp)
            this.serverConn(this.insertHier, payload)
        }
        this.backToCal()
    }

    render(){
        const setName = (e) =>{
            this.setState({userToAdd: e.target.value})
        }

        const updateGroup = (e) =>{
            this.setState({group_id: e.target.value})
        }

        const updateDad = (e) =>{
            this.setState({dad: e.target.value})
        }

        const updateSon = (e) =>{
            this.setState({son: e.target.value})
        }

        return(
            <div>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Aggiungi un gruppo" onClick={this.handleAddGroup} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Aggiungi utente al gruppo" onClick={this.handleAddUser} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Aggiungi gruppo dalla gerarchia" onClick={this.handleHier} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Torna indietro" onClick={this.backToCal} />
                </p>


                {
                    (this.state.showH)?
                        <div><p>
                            <img src={this.state.imageURL +"?user="+this.props.user} />
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <label>Padre</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Select
                                    onChange={updateDad}
                                    defaultValue={""}
                                >
                                    {
                                        this.state.group.map((item, index) => {
                                            return (
                                                <MenuItem key={index} id={index} value={item.name} onChange={updateDad}>
                                                    {item.name}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <label>Figlio</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Select
                                    onChange={updateSon}
                                    defaultValue={""}
                                >
                                    {
                                        this.state.group.map((item, index) => {
                                            return (
                                                <MenuItem key={index} id={index} value={item.name} onChange={updateSon}>
                                                    {item.name}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="submit" value="Aggiungi il gruppo alla gerarchia" onClick={this.handleAddHier} />
                        </p>
                        </div>
                        :
                        <p></p>
                }


                {
                    (this.state.addUser)?
                        <div>
                            <p>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <TextField
                                    label="Nome dell'utente"
                                    onChange={setName}
                                />
                            </p>

                            <p>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <label>Nome del gruppo</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Select
                                onChange={updateGroup}
                                defaultValue={""}
                            >
                                {
                                    this.state.group.map((item, index) => {
                                        return (
                                            <MenuItem key={index} id={index} value={item._id} onChange={updateGroup}>
                                                {item.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                            </p>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="submit" value="Aggiungi l'utente al gruppo" onClick={this.handleUserAdd} />
                        </div>
                        :
                        <p>
                        </p>
                }
            </div>
        )

    }

}

export default UserGroup;