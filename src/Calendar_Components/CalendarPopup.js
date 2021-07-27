import React, {Component} from 'react'
import { Calendar} from 'react-big-calendar'

import 'pretty-checkbox/src/pretty-checkbox.scss'


import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/sass/styles.scss'

import local from "react-big-calendar/lib/localizers/globalize";
import globalize from "globalize";
import axios from "axios";

import FormClass from "./Graphical_Comp/FormClass";
import Precondition from "./Graphical_Comp/Precondition";
import Authorization from "./Graphical_Comp/Authorization";
import Header from "./Graphical_Comp/Header"
import ShowEvents from "./Graphical_Comp/ShowEvents"


import jwtDecode from "jwt-decode";
import {Redirect} from "react-router-dom";
import UserGroup from "./Graphical_Comp/UserGroup";

require('globalize/lib/cultures/globalize.culture.it-IT')
const globalizeLocalize = local(globalize)

const default_uri = "http://192.168.188.79:12345"
const getEventforUser = "/event_vis"
const getAllCal_uri = "/user_cal"

//doc: https://jquense.github.io/react-big-calendar/examples/index.html
//used SessionStorage instead of localStorage; to use localStorage, do not use state.username, but fetch the token from the cache ed decode it with jwt_decode(token) from jwt-decode
class CalendarPopup extends Component {

    constructor(...args) {
        super(...args)
        this.state = {
            events:[],
            culture: 'it',
            eventAddView: true,
            eventView: true,
            authView: true,
            preView: true,
            userGroup: true,
            startTime: 0,
            endTime: 0,
            eventToShow: "",
            logged: !(jwtDecode(sessionStorage.getItem('token')) === null),

        }
        console.log(jwtDecode(sessionStorage.getItem('token')))

        this.handlerHeader = this.handlerHeader.bind(this)
        this.handlerAddEvents = this.handlerAddEvents.bind(this)
        this.handlerEventViews = this.handlerEventViews.bind(this)
        this.handlerAuthView = this.handlerAuthView.bind(this)
        this.handlerPreView = this.handlerPreView.bind(this)
        this.handlerEventViews_withRefresh = this.handlerEventViews_withRefresh.bind(this)
        this.handleUserGroup = this.handleUserGroup.bind(this)

    }

    componentDidMount(){
        this.connectToServer("");
        this.getCalNamesFromServer();
    }


    getCalName (cal_id) {
        for (let i = 0; i < this.state.calendar_names.length; i++) {
            if (this.state.calendar_names[i].id === cal_id)
                return this.state.calendar_names[i].type
        }
        return null
    }


    getCalNamesFromServer() {
        let payload = { id: jwtDecode(sessionStorage.getItem('token')).id, username: jwtDecode(sessionStorage.getItem('token')).username};
        axios.post(default_uri+getAllCal_uri, payload)
            .then(response => {
                this.setState({calendar_names: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    handlerAuthView = (data) =>{
        this.setState({authView: data})
    }

    handlerPreView = (data) =>{
        this.setState({preView: data})
    }

    handleUserGroup = (data) =>{
        this.setState({userGroup: data})
    }


    handlerAddEvents = () => {
        this.setState({eventAddView: true})
        this.setState({events:[]})
    }

    handlerEventViews = () => {
        this.setState({eventView: true})
        this.setState({events:[]})

    }

    handlerEventViews_withRefresh = () => {
        this.setState({eventView: true})
    }



    connectToServer(data) {
        let payload = { id: jwtDecode(sessionStorage.getItem('token')).id, username: jwtDecode(sessionStorage.getItem('token')).username, calendar: data};
        axios.post(default_uri + getEventforUser, payload)
            .then(response => {
                //console.log(response.data)
                let actual_events = this.state.events.map(item => ({...item}))
                let actual_size = actual_events.length
                for(let i=0; i< response.data.length; i++)
                    actual_events[actual_size++] = response.data[i]
                this.setState(() => ({
                    events :actual_events
                }))
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    handlerHeader = (val) => {
        this.setState({events:[]})
        for(let i=0; i< val.length; i++)
            this.connectToServer(val[i])
    }

    handleSelect = ({start, end}) => {
        alert("Intervallo orario selezionato: \n" + start + "\n" + end)
        this.setState({startTime:start, endTime:end})
        this.setState({eventAddView: false})


       // this.setState('url')
        /*const title = window.prompt('New Event name')
        const calendar = window.prompt('Event from this Calendar:')
        if (title)
            this.setState({
                events: [
                    ...this.state.events,
                    {
                        start,
                        end,
                        title,
                        calendar,
                    },
                ],
            })*/
    }


    //9 elements; from the 9-th element, they are all extra props (to 5 - max limit)
    handleClickedEvent  = (e) => {
        const temp = e.calendar
        e.calendar = (this.getCalName(e.calendar))
        this.setState({eventToShow: e, eventView:false, calendar_id: temp})
    }

    render(){
        const copy = this.state.events.map(item => ({...item}))
        if(this.state.events.length){
            copy.map((event, index) =>{
                copy[index].start = new Date(1000*parseFloat(event.start))
                copy[index].end = new Date(1000*parseFloat(event.end))
                copy[index].allDay = (event.allDay === 'true')
            })
        }
        return(
            <React.Fragment>
                {(!this.state.logged)?
                    <Redirect to="/" />
                    :
                        (!this.state.eventAddView)?
                        <div>
                            <FormClass creator={jwtDecode(sessionStorage.getItem('token')).id} calendars={this.state.calendar_names} handlerViews={this.handlerAddEvents} startTime={this.state.startTime} endTime={this.state.endTime} uri={default_uri}/>
                        </div>
                        :
                        (!this.state.preView)?
                            <div>
                                <Precondition user={jwtDecode(sessionStorage.getItem('token')).id} handlerViews={this.handlerPreView} uri={default_uri}/>
                            </div>
                            :
                            (!this.state.authView)?
                                <div>
                                    <Authorization user={jwtDecode(sessionStorage.getItem('token')).id} handlerViews={this.handlerAuthView} uri={default_uri}/>
                                </div>
                                :
                                (!this.state.userGroup)?
                                    <div>
                                        <UserGroup user={jwtDecode(sessionStorage.getItem('token')).id} handlerViews={this.handleUserGroup} uri={default_uri}/>
                                    </div>
                :
                    (!this.state.eventView)?
                        <div>
                            <ShowEvents calendar_id={this.state.calendar_id} user={jwtDecode(sessionStorage.getItem('token')).id} handlernoUpd={this.handlerEventViews_withRefresh} handlerViews={this.handlerEventViews} uri={default_uri} event={this.state.eventToShow}/>
                        </div>
                        :
                        <div>
                            <Header handlerUG={this.handleUserGroup} handlerAuth={this.handlerAuthView} handlerPre={this.handlerPreView} handler={this.handlerHeader} uri={default_uri}/>
                            <Calendar
                                popup
                                selectable
                                culture={this.state.culture}
                                messages={{
                                    'today': "Oggi",
                                    "previous": 'Precedente',
                                    "next": "Successivo",
                                    "month": "Mese",
                                    "week": "Settimana",
                                    "day": "Giorno",
                                    "agenda": "Agenda Giornaliera",
                                    noEventsInRange: 'Non ci sono eventi nella giornata corrente.'
                                }}
                                events={copy}
                                localizer={globalizeLocalize}
                                defaultDate={new Date()}
                                defaultView={"week"}
                                onSelectEvent={this.handleClickedEvent}
                                onDoubleClickEvent={() => alert("Modifica/Cancellazione evento")}
                                onSelectSlot={this.handleSelect}
                                style={{height: "100vh"}}
                                eventPropGetter={event => {
                                    return {
                                        style: {backgroundColor: event.color}
                                    }
                                }}
                            />
                        </div>
                }
            </React.Fragment>
        )
    }

}
export default CalendarPopup
