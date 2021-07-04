import React, {Component} from 'react'
import { Calendar} from 'react-big-calendar'


import {Switch} from "pretty-checkbox-react";
import 'pretty-checkbox/src/pretty-checkbox.scss'


import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/sass/styles.scss'

import localizer from "react-big-calendar/lib/localizers/globalize";
import globalize from "globalize";
import axios from "axios";


require('globalize/lib/cultures/globalize.culture.it-IT')
const globalizeLocalizer = localizer(globalize)
const default_uri = "http://192.168.188.80:12345"
let calendar_types = ["/list_cal_event?type"]



class CalendarPopup extends Component {

    constructor(...args) {
        super(...args)
        this.get_event_uri = default_uri + "/"
        this.state = {events:[], culture: 'it'}
        this.test = []
        this.handler = this.handler.bind(this)
    }

    componentDidMount(){
        this.connectToServer();
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
        console.log(calendar_types.toString() + "=" + val.toString())
        this.get_event_uri = default_uri + calendar_types.toString() + "=" + val.toString()
        this.connectToServer();
       // console.log("Hey, I'm the handler")
        //console.log(this.get_event_uri)
    }



    handleSelect = ({start, end}) => {
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

    backgroundColor = (calendarName) => {
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return '#' + randomColor;
    }

    render(){
        const {events} = this.state;
        if(this.state.events.length){
            events.map((event, index) =>{
                this.state.events[index].start = new Date(1000*parseFloat(event.start))
                this.state.events[index].end = new Date(1000*parseFloat(event.end))
            })
        }
        return(
            <React.Fragment>
               <div>
                <Header handler={this.handler}/>
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
            params: [],
        }
        this.get_calendar_names_uri = default_uri + "/cal";

    }

    componentDidMount(){
        this.callServer();
    }

    callServer() {
        axios.get(this.get_calendar_names_uri)
            .then(response => {
                //console.log(response.data)
                this.setState({posts: response.data});
            })
            .catch(error =>{
                console.log(error);
                this.setState({error: 'Error'});
            })
    }


    render(){

        let cal = []
        const {posts} = this.state;
        if(this.state.posts.length){
            posts.map((post, index) =>{
                cal[index] = post.Type
            })
        }

        const handleChange = (event) =>{
            if(!(this.state.params.find(element => element === event.target.value.toString()))) {
                this.setState(state => ({
                    params : [...state.params, event.target.value.toString()]
                }))
            }
            else {
                let temp = [], j=0
                for(let i=0; i<this.state.params.length; i++)
                    if(!(this.state.params[i] === event.target.value.toString()))
                        temp[j++]= this.state.params[i]
                this.setState(state => ({
                    params : temp
                }))

            }
        }

        const handleSend = () => {
            this.props.handler(this.state.params)
        }


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
                <input type="submit" value="Invio" onClick={handleSend} />
            </>
        )
    }
}

export default CalendarPopup
