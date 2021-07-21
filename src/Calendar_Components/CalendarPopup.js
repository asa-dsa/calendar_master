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
import Header from "./Graphical_Comp/Header"
import ShowEvents from "./Graphical_Comp/ShowEvents"


import jwtDecode from "jwt-decode";
import {Redirect} from "react-router-dom";

require('globalize/lib/cultures/globalize.culture.it-IT')
const globalizeLocalize = local(globalize)

const default_uri = "http://192.168.188.79:12345"
const calendar_multiple_types = ["/list_cal_event_multiple?type"]
const calendar_single_type = ["/list_cal_event?type"]

//doc: https://jquense.github.io/react-big-calendar/examples/index.html
//used SessionStorage instead of localStorage; to use localStorage, do not use state.username, but fetch the token from the cache ed decode it with jwt_decode(token) from jwt-decode
class CalendarPopup extends Component {

    constructor(...args) {
        super(...args)
        this.get_event_uri = default_uri + "/"
        this.state = {
            events:[],
            culture: 'it',
            eventAddView: true,
            eventView: true,
            startTime: 0,
            endTime: 0,
            eventToShow: "",
            logged: !(jwtDecode(sessionStorage.getItem('token')) === null),
            user: (jwtDecode(sessionStorage.getItem('token')).username)
        }

        console.log(jwtDecode(sessionStorage.getItem('token')))

        this.handlerHeader = this.handlerHeader.bind(this)
        this.handlerAddEvents = this.handlerAddEvents.bind(this)
        this.handlerEventViews = this.handlerEventViews.bind(this)

    }

    isThereAUser(){
    }

    componentDidMount(){
        this.connectToServer();
    }

    handlerAddEvents = () => {
        this.setState({eventAddView: true})
    }

    handlerEventViews = () => {
        this.setState({eventView: true})

    }

    connectToServer() {
        this.setState({events:[]})
        //console.log("Connecting to server at this uri:" + this.get_event_uri)
        console.log(this.get_event_uri)
        axios.get(this.get_event_uri)
            .then(response => {
                this.setState({events: response.data});

            })
            .catch(error =>{
                console.log(error);
                this.setState({error: 'Error'});
            })
    }

    handlerHeader = (val) => {
        if((val.toString()).search(',') <0)
            this.get_event_uri = default_uri + calendar_single_type.toString() + "=" + val.toString()
        else
            this.get_event_uri = default_uri + calendar_multiple_types.toString() + "=" + val.toString()
        this.connectToServer();
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
        this.setState({eventToShow: e, eventView:false})
        //alert(this.state.user)
        //send to the visualizer class the e event
        //the visualizer class must count the prop
        //if |props| == 9, shows only essential data
        //otherwise, add n*2 text area to show the extra props
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
                        <FormClass handlerViews={this.handlerAddEvents} start={this.state.startTime} end={this.state.endTime} uri={default_uri}/>
                    </div>
                :
                    (!this.state.eventView)?
                        <div>
                            <ShowEvents handlerViews={this.handlerEventViews} event={this.state.eventToShow}/>
                        </div>
                        :
                        <div>
                            <Header handler={this.handlerHeader} uri={default_uri} owner={this.state.user}/>
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
                                defaultView={"month"}
                                onSelectEvent={this.handleClickedEvent}
                                onDoubleClickEvent={event => alert("Modifica/Cancellazione evento")}
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
