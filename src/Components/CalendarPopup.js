import React from 'react'
import { Calendar} from 'react-big-calendar'
import events from '../events'

import localizer from 'react-big-calendar/lib/localizers/globalize'
import globalize from 'globalize';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

//import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-big-calendar/lib/sass/styles.scss'


//import ExampleControlSlot from '../ExampleControlSlot'

require('globalize/lib/cultures/globalize.culture.it-IT')
//let calendars = ['work', 'home', 'private']

const globalizeLocalizer = localizer(globalize)


class CalendarPopup extends React.Component {

  constructor(...args) {
    super(...args)
    this.state = { events, culture: 'it' }
  }

  handleSelect = ({ start, end }) => {
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

  render() {
    //const { localizer } = this.props
    return (
        <React.Fragment>
          <Calendar
              popup
              selectable
              culture={this.state.culture}
              events={this.state.events}
              localizer={globalizeLocalizer}
              defaultDate={new Date()}
              onSelectEvent={event => alert(event.calendar)}
              onSelectSlot={this.handleSelect}
              style={{ height: "100vh" }}
              eventPropGetter={event => {
                var backgroundColor;
                if(event.calendar==='work')
                  backgroundColor = "#1ff11f";
                else if((event.calendar==='school'))
                    backgroundColor =  "#0a5b3c";
                else
                    backgroundColor =  "#a5203c";
                  return {style: {backgroundColor}};
              }
              }
          />
        </React.Fragment>
    )
  }
}
export default CalendarPopup
