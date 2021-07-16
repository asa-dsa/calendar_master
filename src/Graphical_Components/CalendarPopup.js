import React, {Component} from 'react'
import { Calendar} from 'react-big-calendar'

import 'pretty-checkbox/src/pretty-checkbox.scss'


import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/sass/styles.scss'

import local from "react-big-calendar/lib/localizers/globalize";
import globalize from "globalize";
import axios from "axios";

import FormClass from "./Sub_Graphical_Comp/FormClass";
import Header from "./Sub_Graphical_Comp/Header"

require('globalize/lib/cultures/globalize.culture.it-IT')
const globalizeLocalize = local(globalize)

const default_uri = "http://192.168.188.79:12345"
const calendar_multiple_types = ["/list_cal_event_multiple?type"]
const calendar_single_type = ["/list_cal_event?type"]

//doc: https://jquense.github.io/react-big-calendar/examples/index.html
class CalendarPopup extends Component {

    constructor(...args) {
        super(...args)
        this.get_event_uri = default_uri + "/"
        this.state = {
            events:[],
            culture: 'it',
            views: true,
            startTime: 0,
            endTime: 0,
            user: "UserTest"
        }

        this.handler = this.handler.bind(this)
        this.handlerViews = this.handlerViews.bind(this)
    }

    componentDidMount(){
        this.connectToServer();
    }

    handlerViews = () => {
        this.setState({views: true})
    }

    connectToServer() {
        this.setState({events:[]})
        //console.log("Connecting to server at this uri:" + this.get_event_uri)
        console.log(this.get_event_uri)
        axios.get(this.get_event_uri)
            .then(response => {
                //.log(response.data)
                this.setState({events: response.data});
            })
            .catch(error =>{
                console.log(error);
                this.setState({error: 'Error'});
            })
    }

    handler = (val) => {
        if((val.toString()).search(',') <0)
            this.get_event_uri = default_uri + calendar_single_type.toString() + "=" + val.toString()
        else
            this.get_event_uri = default_uri + calendar_multiple_types.toString() + "=" + val.toString()
        this.connectToServer();
    }

    handleSelect = ({start, end}) => {
        alert("Intervallo orario selezionato: \n" + start + "\n" + end)
        this.setState({startTime:start, endTime:end})
        this.setState({views: false})

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

    render(){
        const {events} = this.state;
        if(this.state.events.length){
            events.map((event, index) =>{
                this.state.events[index].start = new Date(1000*parseFloat(event.start))
                this.state.events[index].end = new Date(1000*parseFloat(event.end))
                this.state.events[index].allDay = (event.allDay === 'true')
            })
        }

        return(
            <React.Fragment>
                {(!this.state.views)?
                    <div>
                        <FormClass handlerViews={this.handlerViews} start={this.state.startTime} end={this.state.endTime} uri={default_uri}/>
                    </div>
                :
                <div>
                    <Header handler={this.handler} uri={default_uri} owner={this.state.user}/>
                   <Calendar
                    popup
                    selectable
                    culture={this.state.culture}
                    messages={{'today': "Oggi", "previous":'Precedente', "next":"Successivo",
                        "month":"Mese", "week":"Settimana", "day":"Giorno", "agenda": "Agenda Giornaliera",
                        noEventsInRange: 'Non ci sono eventi nella giornata corrente.'}}
                    events={this.state.events}
                    localizer={globalizeLocalize}
                    defaultDate={new Date()}
                    onSelectEvent={event => alert("Elenco props. evento")}
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
