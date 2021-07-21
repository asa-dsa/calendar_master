import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";

import {CirclePicker} from "react-color";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";


const noMoreProps = 9
const getAllCal_uri = "/cal"
const oneDayMs = 86400 * 1000

class ShowEvents extends Component{

    constructor(props) {
        super(props);
        this.state = {
            event: this.props.event,
            updateView: true,
            calendar_names:[],
            color: ""
        }
        this.get_calendar_names_uri = this.props.uri + getAllCal_uri;
        this.value_temp = ""

    }

    componentDidMount(){
        this.getCalNamesFromServer();
    }


    getCalNamesFromServer() {
        axios.get(this.get_calendar_names_uri)
            .then(response => {
                //console.log(response.data)
                this.setState({calendar_names: response.data})
            })
            .catch(error =>{
                console.log(error);
            })
    }

    render(){
        let copy_event = this.state.event
        let cal = []
        const {calendar_names} = this.state;
        if(this.state.calendar_names.length){
            calendar_names.map((post, index) =>{
                cal[index] = post.Type
            })
        }


        const backToCal =() => {
            this.props.handlerViews()
        }

        const updateData =() => {
            this.setState({updateView: false})
        }

        const addUpdatedData =() => {
            //send this.state.event
            console.log(this.state.event)
        }


        const updateStartDate = (e) => {
            copy_event.startTime = e.target.value
            this.setState({[this.state.event]: copy_event})

        }


        const updateEndDate = (e) => {
            let endDate = new Date(e.target.value)
            if(endDate-this.state.startTime >= oneDayMs || endDate <= this.state.startTime) {
                const tempTime = new Date(this.state.startTime);
                tempTime.setHours(23);
                tempTime.setMinutes(59)
                copy_event.endTime = tempTime
                this.setState({[this.state.event]: copy_event})
            }
            else{
                copy_event.endTime = e.target.value
                this.setState({[this.state.event]: copy_event})
            }

        }


        const deleteEvent =() => {
            alert("Cancellazione evento")
            backToCal()
        }

        const updateCal = (e) => {
            copy_event.calendar = e.target.value
            this.setState({[this.state.event]: copy_event})
        }


        const updateTitle = (e) => {
            copy_event.title = e.target.value
            this.setState({[this.state.event]: copy_event})
        }


        const updateType = (e) => {
            copy_event.type = e.target.value
            this.setState({[this.state.event]: copy_event})
        }

        const updateCheckBox = () => {
            copy_event.allDay = !copy_event.allDay
            this.setState({[this.state.event]: copy_event})
        }

        const handleColorChange = ({ hex }) => {
            copy_event.color = hex
            this.setState({[this.state.event]: copy_event})
        }


        const handleValue = (e, data) => {
            copy_event[data.key] = e.target.value
            this.setState({[this.state.event]: copy_event})
        }

        let timezone_off = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        let numero_prop = (Object.keys(this.state.event).length - noMoreProps)

        return(

            <div>
                <div align="center">
                    <p>
                        <TextField
                            label="Titolo dell'evento"
                            defaultValue={this.state.event.title}
                            disabled={this.state.updateView}
                            onChange={updateTitle}
                        />
                    </p>

                    <p>
                        {(this.state.updateView)?
                            <TextField
                            label="Nome del calendario"
                            defaultValue={this.state.event.calendar}
                            disabled={this.state.updateView}
                            />
                        :
                            <p>
                                <label>Nome del calendario </label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Select
                                    onChange={updateCal}
                                    defaultValue={this.state.event.calendar}
                                >
                                    {
                                        cal.map((item, index) => {
                                            return (
                                                <MenuItem key={index} id={index} value={item} onChange={updateCal}>
                                                    {item}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </p>
                        }
                    </p>
                    <p>
                        <TextField
                            label="Tipo dell'evento"
                            defaultValue = {this.state.event.type}
                            disabled = {this.state.updateView}
                            onChange={updateType}
                        />
                    </p>

                    <p>
                        <label>Colore associato all'evento</label>
                    </p>

                    <p>
                    <CirclePicker
                        onChangeComplete={handleColorChange}
                        color = {this.state.event.color}
                    />
                    </p>

                    <p>
                        <TextField
                            id="datetime-start"
                            label="Data e ora di inizio dell'evento"
                            type="datetime-local"
                            defaultValue={(new Date(this.state.event.start- timezone_off)).toISOString().slice(0,-1).substring(0,16)}
                            disabled={this.state.updateView}
                            onChange={updateStartDate}
                        />
                    </p>
                    <p>
                        <TextField
                            id="datetime-end"
                            label="Data e ora di fine dell'evento"
                            type="datetime-local"
                            defaultValue={(new Date(this.state.event.end- timezone_off)).toISOString().slice(0,-1).substring(0,16)}
                            disabled={this.state.updateView}
                            onChange={updateEndDate}

                        />
                    </p>

                    <p>
                        <label>Evento con durata giornaliera</label>
                        <Switch
                            defaultValue={this.state.event.allDay}
                            checked={this.state.event.allDay}
                            name="allDay"
                            disabled={this.state.updateView}
                            onChange={updateCheckBox}
                        />
                    </p>

                    { (numero_prop===0)?
                        <p>
                        </p>
                        :
                        Object.keys(this.state.event).map((key, index) =>{
                            if(index >= noMoreProps)
                                return(
                                    <p>
                                        <TextField id={"standard-basic "+key} defaultValue={key} disabled={true}/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <TextField id={"filled-basic "+key} variant="filled" onChange= {(e) => {handleValue(e, {key})}} defaultValue={this.state.event[key]} disabled={this.state.updateView}/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                    </p>
                                )
                        })
                    }

                <p><Button variant="contained" onClick={updateData}>Modifica l'evento</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button variant="contained" onClick={addUpdatedData} disabled={this.state.updateView}>Aggiungi l'evento modificato</Button></p>
                <p><Button variant="contained" onClick={deleteEvent}>Cancella l'evento</Button></p>
                <p><Button variant="contained" onClick={backToCal}>Torna al calendario</Button></p>
                </div>

            </div>
        )

    }
}
export default ShowEvents;