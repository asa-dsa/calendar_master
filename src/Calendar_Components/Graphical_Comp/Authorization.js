import React, {Component} from "react";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const getCal_uri ="/list_cal_owner"
const getType_uri ="/all_type_event"
const getGroup_uri = "/list_created_group"
const calEvent = "/calendar_event"
const addAuth = "/ins_auth"


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
            views: restriction[0]
        }
        this.getCalURL = this.props.uri + getCal_uri
        this.getTypesURL = this.props.uri + getType_uri
        this.insertedGroup = this.props.uri + getGroup_uri;
        this.getCalEventURI = this.props.uri + calEvent
        this.addAuthURL = this.props.uri + addAuth

    }

    componentDidMount() {
        this.getCal()
        this.getTypes()
        this.getGroup()
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
                console.log(response.data)
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



    backToCal = () =>{
        this.props.handlerViews(true)
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
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Torna indietro" onClick={this.backToCal} />
                </p>
            </div>
        )
    }

}

export default Authorization;