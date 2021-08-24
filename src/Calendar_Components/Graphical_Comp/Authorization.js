import React, {Component} from "react";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const getCal_uri ="/list_cal_owner"
const getType_uri ="/all_type_event"
const getGroup_uri = "/list_created_group"
const calEvent = "/calendar_event"
const addAuth = "/ins_auth"
const getAuth = "/list_auth"
const removeAuth="/delete_auth"
const getDelegateCalendar="/calendar_delegate"
const getDelegateGroups="/groups_delegate"
const getDelegateEvents="/events_delegate"
const getDelegateTypes="/types_delegate"


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
            del_groups: [],
            del_types: [],
            del_events: [],
            views: restriction[0],
            showAuth: false,
            showAdd: false,
            showAddDel: false,
        }
        this.getCalURL = this.props.uri + getCal_uri
        this.getTypesURL = this.props.uri + getType_uri
        this.insertedGroup = this.props.uri + getGroup_uri;
        this.getCalEventURI = this.props.uri + calEvent
        this.addAuthURL = this.props.uri + addAuth
        this.getAllAuthURL = this.props.uri + getAuth
        this.deleteAuthURL = this.props.uri + removeAuth
        this.getCalDel= this.props.uri + getDelegateCalendar
        this.getGroupDel = this.props.uri + getDelegateGroups
        this.getEventsDelURL = this.props.uri + getDelegateEvents
        this.getTypesDelURL = this.props.uri + getDelegateTypes
    }

    componentDidMount() {
        this.getCal()
        this.getTypes()
        this.getGroup()
        this.getAllAuth()
        this.getDelegateCalendars()
    }

    //gruppo creato dall'utente loggato al momento (id), calendar (id), typo = (any, Ti, Ei), prop (null), tipo (freeBusy, read e write) e segno

    handleAddAuth = () =>{
        let res = {
            creator: this.props.user,
            calendar_id: this.state.calendar_id,
            group_id: this.state.group_id,
            type_auth: this.state.type_auth,
            sign: this.state.sign,
            auth: this.state.views,
            delegate: (this.state.showAddDel).toString()
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


    getDelegateCalendars = () =>{
        let payload = { id: this.props.user};
        axios.post(this.getCalDel, payload)
            .then(response => {
                this.setState({del_calendars: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
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

    getGroupWithDel = (data) =>{
        let payload = {id: this.props.user, calendar_id: data};
        axios.post(this.getGroupDel, payload)
            .then(response => {
                this.setState({del_groups: response.data})
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

    getEventsDel = () =>{
        let payload = { id: this.props.user, calendar_id: this.state.calendar_id};
        axios.post(this.getEventsDelURL, payload)
            .then(response => {
                this.setState({del_events: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getTypesDel = () =>{
        let payload = { id: this.props.user, calendar_id: this.state.calendar_id};
        axios.post(this.getTypesDelURL, payload)
            .then(response => {
                this.setState({del_types: response.data})
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
        let payload = { id: this.props.user, calendar: data};
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

    handleAuthDelegate = () =>{
        this.setState({showAddDel: !this.state.showAddDel})
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
            if(this.state.showAddDel)
                this.getGroupWithDel(cal_id)
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
            if(e.target.value === restriction[1])
                this.getTypesDel()
            else if(e.target.value === restriction[2])
                this.getEventsDel()

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
                    <input type="submit" value="Aggiungi auth (come delegato)" onClick={this.handleAuthDelegate} />
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
                                                    Gruppo: {item.group_id}&nbsp; Calendario: {item.calendar_id}&nbsp;Segno: {item.sign}&nbsp; Tipo auth: {item.auth}&nbsp; Condizione: {item.condition}&nbsp;Scope: {item.type_auth}&nbsp;Inserita da delegato: {item.delegate}
                                                </MenuItem>
                                            </p>
                                        )
                                    })
                                }
                            </div>
                            :
                            (this.state.showAddDel) ?
                                <div>
                                    <p>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <label>Nome del calendario</label>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Select
                                            onChange={updateCal}
                                            defaultValue={""}
                                        >
                                            {
                                                this.state.del_calendars.map((item, index) => {
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
                                        <label>Nome del gruppo</label>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Select
                                            onChange={updateGroup}
                                            defaultValue={""}
                                        >
                                            {
                                                this.state.del_groups.map((item, index) => {
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
                                                        this.state.del_types.map((item, index) => {
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
                                                            this.state.del_events.map((item, index) => {
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
                                <p/>
                }
            </div>
        )
    }

}

export default Authorization;