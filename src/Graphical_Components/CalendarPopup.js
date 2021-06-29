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


class CalendarPopup extends Component {

    constructor(...args) {
        super(...args)
        this.get_event_uri = 'http://0.0.0.0:12345/'
        this.state = {events:[], culture: 'it'}
        this.handler = this.handler.bind(this)
    }

    componentDidMount(){
        this.connectToServer();
    }

    connectToServer() {
        this.setState({events:[]})
        console.log("Connecting to server at this uri:" + this.get_event_uri)
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
        this.get_event_uri = this.get_event_uri + "type=" +val
        this.connectToServer();
        console.log("Hey, I'm the handler")
        console.log(this.get_event_uri)
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
                console.log(event)
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
        }
        this.get_calendar_names_uri = 'http://0.0.0.0:12345/cal';

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
        let cal = [], toSend= [];
        const {posts} = this.state;
        if(this.state.posts.length){
            posts.map((post, index) =>{
                cal[index] = post.Type
            })
        }
        const calNumber = [...Array(cal.length)];
        for (var i=0; i< calNumber.length; i++)
            calNumber[i]=false

        const handleChange = event  =>{

            if(!(calNumber)[event.target.id]) {
                this.get_calendar_names_uri= this.get_calendar_names_uri+(event.target.value.toString())+"-"
               // console.log(this.uri)
               // console.log(event.target.value)
                calNumber[event.target.id] = true;

                //this.callServer();
            }
            else {
                calNumber[event.target.id] = false;
                this.get_calendar_names_uri= this.get_calendar_names_uri.replace((event.target.value+"-"), "")

                //console.log(this.uri)
                //console.log("Non " + event.target.value);
            }
        }
    //const {posts} = this.state;
        //if(posts.length)
          //  console.log(posts)



        const handleClick = () =>{
            var toSend = []
            let j = 0;
            for(var i=0; i<calNumber.length; i++)
                if(calNumber[i])
                    toSend[j++] = cal[i]
            this.props.handler(toSend)
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
                <button type={"submit"} onClick={handleClick}>Invia</button>
            </>
        )
    }
}

export default CalendarPopup
