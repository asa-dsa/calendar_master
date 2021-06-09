import React from 'react'
import { Calendar} from 'react-big-calendar'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/sass/styles.scss'
import events from "../events";
import Header from "./Header";

import localizer from "react-big-calendar/lib/localizers/globalize";
import globalize from "globalize";


require('globalize/lib/cultures/globalize.culture.it-IT')
const globalizeLocalizer = localizer(globalize)

class CalendarPopup extends React.Component {
    constructor(...args) {
        super(...args)
        this.state = {events, culture: 'it'}
    }



    handleSelect = ({start, end}) => {
        const title = window.prompt('New Event name')
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
            })
    }

    backgroundColor = (calendarName) => {
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return '#' + randomColor;
    }


    render(){
        return(
            <React.Fragment>
                <Header/>
                <Calendar
                    popup
                    selectable
                    culture={this.state.culture}
                    events={this.state.events}
                    localizer={globalizeLocalizer}
                    defaultDate={new Date()}
                    onSelectEvent={event => alert(event.calendar)}
                    onSelectSlot={this.handleSelect}
                    style={{height: "100vh"}}
                    eventPropGetter={event => {
                        return {
                            style: {backgroundColor: this.backgroundColor(event.calendar)}
                        }
                    }}
                />
            </React.Fragment>
        )
    }
}
export default CalendarPopup
