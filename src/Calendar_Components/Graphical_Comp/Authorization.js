import React, {Component} from "react";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {TextField} from "@material-ui/core";

const getCal_uri ="/list_cal_owner"
const getType_uri ="/all_type_event"
const getGroup_uri = "/list_created_group"
const calEvent = "/calendar_event"
const addAuth = "/ins_auth"
const getAuth = "/list_auth"
const removeAuth="/delete_auth"

const authTypes = ["freeBusy", "read", "write"]
const authSign = ["+", "-"]
const restriction = ["any", "tipo", "evento"]

class Authorization extends Component{

    constructor(props) {
        super(props);
        this.state = {
            calendar: [],
            types: [],
            events: [],
            group: [],
            auth: [],
            views: restriction[0],
            showAuth: false,
            showAdd: false
        }
        this.getCalURL = this.props.uri + getCal_uri
        this.getTypesURL = this.props.uri + getType_uri
        this.insertedGroup = this.props.uri + getGroup_uri;
        this.getCalEventURI = this.props.uri + calEvent
        this.addAuthURL = this.props.uri + addAuth
        this.getAllAuthURL = this.props.uri + getAuth
        this.deleteAuthURL = this.props.uri + removeAuth
    }

    componentDidMount() {
        this.getCal()
        this.getTypes()
        this.getGroup()
        this.getAllAuth()
    }

    //gruppo creato dall'utente loggato al momento (id), calendar (id), typo = (any, Ti, Ei), prop (null), tipo (freeBusy, read e write) e segno

    handleAddAuth = () =>{
        let res = {
            creator: this.props.user,
            calendar_id: this.state.calendar_id,
            group_id: this.state.group_id,
            type_auth: this.state.type_auth,
            sign: this.state.sign,
            auth: this.state.views
        };
        let temp = {}
        if(this.state.views === restriction[0])
            temp = JSON.stringify({condition: this.state.views})
        else if(this.state.views === restriction[1])
            temp = JSON.stringify({condition: this.state.type})
        else
            temp = JSON.stringify({condition: this.state.event})
        let payload = (JSON.stringify(res).concat(temp)).replace("}{", ",")
        axios.post(this.addAuthURL, payload)
            .then(response => {
                alert(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        this.backToCal()

    }


    getAllAuth = () =>{
        let payload = { id: this.props.user};
        axios.post(this.getAllAuthURL, payload)
            .then(response => {
                this.setState({auth: response.data})
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

    getCal = () =>{
        let payload = { id: this.props.user};
        axios.post(this.getCalURL, payload)
            .then(response => {
                this.setState({calendar: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getTypes = () =>{
        let payload = { id: this.props.user};
        axios.post(this.getTypesURL, payload)
            .then(response => {
                this.setState({types: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getEvents = (data) =>{
        let payload = { calendar: data};
        axios.post(this.getCalEventURI, payload)
            .then(response => {
                this.setState({events: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    handleShow = () =>{
        this.setState({showAuth: !this.state.showAuth})

    }

    handleAdd = () =>{
        this.setState({showAdd: !this.state.showAdd})
    }


    backToCal = () =>{
        this.props.handlerViews(true)
    }

    getGroupName = (group_id) =>{
        let name = ""
        if(this.state.group.length){
            this.state.group.map((item, index) => {
                let id = JSON.stringify(item._id).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
                if(id === group_id) {
                    console.log(item.name)
                    name = item.name
                }
            })
        }
        return name
    }


    getCalName = (cal_id) =>{
        let name = ""
        if(this.state.calendar.length){
            this.state.calendar.map((item, index) => {
                let id = JSON.stringify(item._id).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
                if(id === cal_id) {
                    console.log(item.type)
                    name = item.type
                }
            })
        }
        return name
    }

    render(){
        const updateGroup = (e) =>{
            let group_id = JSON.stringify(e.target.value).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
            this.setState({group_id: group_id})
        }

        const updateSign = (e) =>{
            this.setState({sign: e.target.value})
        }

        const updateViews = (e) =>{
            this.setState({type_auth: e.target.value})
        }


        const updateCal = (e) =>{
            let cal_id = JSON.stringify(e.target.value).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
            this.setState({calendar_id: cal_id})
            this.getEvents(cal_id)
        }

        const deleteAuth = (e) =>{
            const esito = (prompt("Sei sicuro di voler cancellare l'autorizzazione?", "No")).toUpperCase()
            if(esito === "SI") {
                let temp_id = (this.state.auth[e.target.value]._id)
                let auth_id = JSON.stringify(temp_id).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
                this.setState({auth_to_del: auth_id})
                let payload = ({"auth_id":auth_id})
                axios.post(this.deleteAuthURL, payload)
                    .then(response => {
                        alert(response.data)
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                this.backToCal()

                this.getAllAuth()
            }else
                alert("Cancellazione annullata con successo")
        }


        const updateRestr = (e) =>{
            this.setState({views: e.target.value})
        }

        const updateType = (e) =>{
            this.setState({type: e.target.value})
        }

        const updateEvent = (e) =>{
            let event_id = JSON.stringify(e.target.value).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
            this.setState({event: event_id})
        }

        return(
            <div>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Aggiungi auth" onClick={this.handleAdd} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Lista auth inserite" onClick={this.handleShow} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Torna indietro" onClick={this.backToCal} />
                </p>
                {
                    (this.state.showAdd) ?
                        <div>
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

                            <p>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <label>Nome del calendario</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Select
                                    onChange={updateCal}
                                    defaultValue={""}
                                >
                                    {
                                        this.state.calendar.map((item, index) => {
                                            return (
                                                <MenuItem key={index} id={index} value={item._id} onChange={updateCal}>
                                                    {item.type}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </p>
                        <p>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <label>Criteri di restrizione</label>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select
                            onChange={updateRestr}
                            defaultValue={""}
                            >
                            {
                                restriction.map((item, index) => {
                                return (
                                <MenuItem key={index} id={index} value={item} onChange={updateRestr}>
                            {item}
                                </MenuItem>
                                )
                            })
                            }
                            </Select>
                        </p>

                        {
                            (this.state.views === restriction[1])?
                            <p>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <label>Tipo dell'evento</label>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select
                            onChange={updateType}
                            defaultValue={""}
                            >
                        {
                            this.state.types.map((item, index) => {
                            return (
                            <MenuItem key={index} id={index} value={item} onChange={updateType}>
                        {item}
                            </MenuItem>
                            )
                        })
                        }
                        </Select>
                        </p>
                        :
                        (this.state.views === restriction[2])?
                                <p>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <label>Evento</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Select
                                onChange={updateEvent}
                                defaultValue={""}
                                >
                            {
                                this.state.events.map((item, index) => {
                                return (
                                <MenuItem key={index} id={index} value={item._id} onChange={updateEvent}>
                                    {item.title}
                                </MenuItem>
                                )
                            })
                            }
                                </Select>
                                </p>
                                :
                                <p>
                                </p>
                            }

                        <p>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <label>Visibilità dell'autorizzazione</label>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Select
                        onChange={updateViews}
                        defaultValue={""}
                        >
                    {
                        authTypes.map((item, index) => {
                        return (
                        <MenuItem key={index} id={index} value={item} onChange={updateViews}>
                    {item}
                        </MenuItem>
                        )
                    })
                    }
                        </Select>
                        </p>

                        <p>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <label>Segno dell'autorizzazione</label>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Select
                        onChange={updateSign}
                        defaultValue={""}
                        >
                    {
                        authSign.map((item, index) => {
                        return (
                        <MenuItem key={index} id={index} value={item} onChange={updateSign}>
                    {item}
                        </MenuItem>
                        )
                    })
                    }
                        </Select>
                        </p>


                        <p>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="submit" value="Aggiungi auth" onClick={this.handleAddAuth} />
                        </p>
                    </div>
                    :
                        (this.state.showAuth) ?
                            <div>
                                {
                                    this.state.auth.map((item, index) => {
                                        return (
                                            <p>
                                                <MenuItem key={index} id={index} value={index} onClick={deleteAuth}>
                                                    Gruppo: {this.getGroupName(item.group_id)}&nbsp; Calendario: {this.getCalName(item.calendar_id)}&nbsp;Segno: {item.sign}&nbsp; Tipo auth: {item.auth}&nbsp; Condizione: {item.condition}&nbsp;Scope: {item.type_auth}
                                                </MenuItem>
                                            </p>
                                        )
                                    })
                                }
                            </div>
                            :
                            <p></p>
                }
            </div>
        )
    }

}

export default Authorization;