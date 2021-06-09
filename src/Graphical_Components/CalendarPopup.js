import React, {Component} from 'react'
import { Calendar} from 'react-big-calendar'


import {Switch} from "pretty-checkbox-react";
import 'pretty-checkbox/src/pretty-checkbox.scss'


import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/sass/styles.scss'
import events from "../events";

import localizer from "react-big-calendar/lib/localizers/globalize";
import globalize from "globalize";
import axios from "axios";


require('globalize/lib/cultures/globalize.culture.it-IT')
const globalizeLocalizer = localizer(globalize)


class CalendarPopup extends Component {

    constructor(...args) {
        super(...args)
        this.state = {events, culture: 'it'}
    }

    handleSelect = ({start, end}) => {
       // this.setState('url')
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
               <div>
                <Header/>
               </div>
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

class Header extends Component{

    constructor(props) {
        super(props);
        this.state = {
            posts : [],
            uri:'http://192.168.178.63:8080/'
        }
    }

    componentDidMount(){
        this.callServer();
    }

    callServer() {
        axios.get(this.state.uri)
            .then(response => {
                console.log(response.data)
                this.setState({posts: response.data});
            })
            .catch(error =>{
                console.log(error);
                this.setState({error: 'Error'});
            })
    }

    render(){
        //const {posts} = this.state;
        //if(posts.length)
          //  console.log(posts)
        const cal = ['lavoro', 'home'];
        const calNumber = [...Array(cal.length)];

        const handleChange = event => {
            if(!calNumber[event.target.id]) {
                console.log(event.target.value)
                calNumber[event.target.id] = true;
                this.setState({uri: 'https://jsonplaceholder.typicode.com/posts'})
                this.callServer();
            }
            else {
                calNumber[event.target.id] = false;
                console.log("Non " + event.target.value);
            }
        };
        return (
            <>
                {
                    cal.map((item, index) => {
                        return(
                            <Switch key= {index} id={index} value={item} onChange={handleChange}>
                                {item}
                            </Switch>
                        )
                    })
                }
            </>
        )
    }
}


export default CalendarPopup
