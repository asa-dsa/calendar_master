import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";

import {CirclePicker} from "react-color";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import axios from "axios";


const noMoreProps = 9
const delete_uri = "/delete_event"
const update_uri = "/mod_event"

const oneDayMs = 86400 * 1000


class ShowEvents extends Component{

    constructor(props) {
        super(props);
        this.state = {
            event: this.props.event,
            updateView: true,
            error: false,
            user: this.props.user
        }
        this.deleteURL = this.props.uri + delete_uri;
        this.updateURL = this.props.uri + update_uri;
        this.value_temp = ""
        this.disableUpdateNoOwner = false /*!(this.state.user === this.state.event.creator)*/
    }


    render(){
        let copy_event = this.state.event


        const backToCal =() => {
            this.props.handlerViews()
        }

        const backToCalNoUpd =() => {
            this.props.handlernoUpd()
        }

        const updateData =() => {
            this.setState({updateView: false})
            copy_event.start = new Date(this.state.event.start).valueOf()
            copy_event.end = new Date(this.state.event.end).valueOf()
            const a = JSON.stringify(this.state.event._id)
            copy_event._id =  a.replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
            this.setState({event: copy_event})

        }



        function replacer(key, value) {
            if (typeof value === 'number' || typeof value === 'boolean') {
                if(key === "start" || key ==="end")
                    return (value/1000).toString()
                return value.toString()
            }
            return value
        }

        const wrapper =() => {
            copy_event.calendar = this.props.calendar_id
            this.setState({event: copy_event})
            addUpdatedData()
        }

        const addUpdatedData =() => {
            if(this.state.error)
                alert("Errore nell'inserimento della data di fine evento; data di fine evento impostata a " + this.state.event.end)

            const temp_payload = JSON.stringify(this.state.event, replacer)
            const a = JSON.stringify({"username": this.state.user})
            let payload = (temp_payload.concat(a)).replace("}{", ",")
            console.log(payload)
            axios.post(this.updateURL, payload)
                .then(response => {
                    console.log(response.data)
                    alert(response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
            backToCal()
        }

        const updateStartDate = (e) => {
            copy_event.start = new Date(e.target.value).valueOf()
            this.setState({[this.state.event]: copy_event})
        }

        const updateEndDate = (e) => {
            let endDate = new Date(e.target.value).valueOf()
            if(endDate-this.state.event.start >= oneDayMs || endDate <= this.state.event.start) {
                const tempTime = new Date(this.state.event.start);
                tempTime.setHours(23);
                tempTime.setMinutes(59)
                copy_event.end = tempTime.valueOf()
                this.setState({[this.state.event]: copy_event})
                this.setState({error: true})
            }
            else{
                copy_event.end = endDate.valueOf()
                this.setState({[this.state.event]: copy_event})
            }

        }

        const deleteEvent = () => {
            const a = JSON.stringify(this.state.event._id)
            const user_id = a.replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
            alert("Cancellazione dell'evento " + this.state.event.title)

            let to_send = {
                "_id": user_id,
                "user": this.state.user
            }

            let payload = JSON.stringify(to_send)
            axios.post(this.deleteURL, payload)
                .then(response => {
                    alert(response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });

            backToCal()
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
                        <TextField
                            label="Nome del calendario"
                            defaultValue={(this.state.event.calendar)}
                            disabled={true}
                        />
                    </p>

                    {/*<p>*/}
                    {/*        (this.state.updateView || this.disableUpdateNoOwner)?*/}
                    {/*        <TextField*/}
                    {/*        label="Nome del calendario"*/}
                    {/*        defaultValue={(this.state.event.calendar)}*/}
                    {/*        disabled={this.disableUpdateNoOwner}*/}
                    {/*        />*/}
                    {/*    :*/}
                    {/*        <p>*/}
                    {/*            <label>Nome del calendario </label>*/}
                    {/*            &nbsp;&nbsp;&nbsp;&nbsp;*/}
                    {/*            <Select*/}
                    {/*                onChange={updateCal}*/}
                    {/*                defaultValue={(this.state.event.calendar)}*/}
                    {/*            >*/}
                    {/*                {*/}
                    {/*                    calendar_names.map((item, index) => {*/}
                    {/*                        return (*/}
                    {/*                            <MenuItem key={index} id={item.id} value={item.id} onChange={updateCal}>*/}
                    {/*                                {item.type}*/}
                    {/*                            </MenuItem>*/}
                    {/*                        )*/}
                    {/*                    })*/}
                    {/*                }*/}
                    {/*            </Select>*/}
                    {/*        </p>*/}
                    {/*    }*/}
                    {/*</p>*/}

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
                            disabled={this.disableUpdateNoOwner}
                            onChange={updateStartDate}
                        />
                    </p>
                    <p>
                        <TextField
                            id="datetime-end"
                            label="Data e ora di fine dell'evento"
                            type="datetime-local"
                            defaultValue={(new Date(this.state.event.end- timezone_off)).toISOString().slice(0,-1).substring(0,16)}
                            disabled={this.disableUpdateNoOwner}
                            onChange={updateEndDate}

                        />
                    </p>

                    <p>
                        <label>Evento con durata giornaliera</label>
                        <Switch
                            defaultValue={this.state.event.allDay}
                            checked={this.state.event.allDay}
                            name="allDay"
                            disabled={this.disableUpdateNoOwner}
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
                <Button variant="contained" onClick={wrapper} disabled={this.state.updateView}>Salva l'evento modificato</Button></p>
                <p><Button variant="contained" onClick={deleteEvent}>Cancella l'evento</Button></p>
                <p><Button variant="contained" onClick={backToCalNoUpd}>Torna al calendario</Button></p>
                </div>

            </div>
        )

    }
}
export default ShowEvents;