import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { CirclePicker } from 'react-color'
import axios from "axios";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const oneDayMs = 86400 * 1000
const maxProps = 5
const insertUri = "/insert_event"


let showProp = new Array(maxProps);
let lastInserted = 0

class FormClass extends Component{


    constructor(props) {
        super(props);
        this.state = {
            title: "",
            allDay: false,
            calendar: "",
            color: "",
            type:"",
            start: new Date(this.props.startTime).valueOf(),
            end: new Date(this.props.endTime).valueOf(),
            creator: this.props.creator
        }
        this.calendar_names = this.props.calendars
        this.prop_temp = ""
        this.value_temp = ""
        this.insertURL = this.props.uri + insertUri;
        for (let i=0; i<maxProps; i++)
            showProp[i] = false
        lastInserted = 0
    }


    render() {
        //use when send a message to return back to the calendar
        const handleSend = () => {
            this.props.handlerViews()
        }

        const updateStartDate = (e) => {
            this.setState({start: (new Date(e.target.value).valueOf)})
        }


        const updateEndDate = (e) => {
            let endDate = new Date(e.target.value).valueOf()
            if(endDate-this.state.start >= oneDayMs || endDate <= this.state.start) {
                const tempTime = new Date(this.state.start);
                tempTime.setHours(23);
                tempTime.setMinutes(59)
                this.setState({end: tempTime.valueOf})
                this.setState({error: true})
            }
            else
                this.setState({end: endDate})

        }

        const updateTitle = (e) => {
            this.setState({title: e.target.value})
        }

        const updateCal = (e) => {
            this.setState({calendar: e.target.value})
        }


        const updateType = (e) => {
            this.setState({type: (e.target.value).toUpperCase()})
        }

        const updateCheckBox = () => {
            this.setState({allDay : !this.state.allDay})
        }

        function replacer(key, value) {
            if (typeof value === 'number' || typeof value === 'boolean') {
                if(key === "start" || key ==="end")
                    return (value/1000).toString()
                return value.toString()
            }
            return value
        }

        const onSend =() => {
            if(this.state.error)
                alert("Errore nell'inserimento della data di fine evento; data di fine evento impostata a " + this.state.endTime)
            let payload = JSON.stringify(this.state, replacer)
            axios.post(this.insertURL, payload)
                .then(response => {
                    console.log(response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
            handleSend()
        }

        const backToCal =() => {
            handleSend()
        }


        const handleColorChange = ({ hex }) => {
            this.setState({color: hex})
        }

        const handleProp = (e) => {
            this.prop_temp = e.target.value

        }

        const handleValue = (e) => {
            this.value_temp = e.target.value

        }

        const handlePropAdding = () =>{
            showProp[lastInserted++] = true
            this.setState({[this.prop_temp]:this.value_temp})
        }

        let timezone_off = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

        return (
                <div align="center">
                    <p>
                    <TextField
                        label="Titolo dell'evento"
                        onChange={updateTitle}
                    />
                    </p>

                        <p>
                            <label>Nome del calendario </label>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select
                                onChange={updateCal}
                                defaultValue={""}
                            >
                                {
                                    this.calendar_names.map((item, index) => {
                                        return (
                                            <MenuItem key={index} id={index} value={item.id} onChange={updateCal}>
                                                {item.type}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </p>
                    <p>
                    <TextField
                        label="Tipo dell'evento"
                        onChange={updateType}
                    />
                    </p>

                    <p>
                        <label>Colore associato all'evento</label>
                        </p><p>
                        <CirclePicker
                            onChangeComplete={handleColorChange}
                            color = {this.state.color}
                        />
                    </p>

                    <p>
                        <TextField
                            id="datetime-start"
                            label="Data e ora di inizio dell'evento"
                            type="datetime-local"
                            defaultValue={(new Date(this.props.startTime - timezone_off)).toISOString().slice(0,-1).substring(0,16)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={updateStartDate}
                        />
                    </p>
                    <p>
                    <TextField
                            id="datetime-end"
                            label="Data e ora di fine dell'evento"
                            type="datetime-local"
                            defaultValue={(new Date(this.props.endTime - timezone_off)).toISOString().slice(0,-1).substring(0,16)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={updateEndDate}
                        />
                    </p>

                    <p>
                    <label>Evento con durata giornaliera</label>
                    <Switch
                        checked={this.state.allDay}
                        onChange={updateCheckBox}
                        defaultValue={this.state.allDay}
                        name="allDay"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    </p>

                    <p>
                    <TextField id="standard-basic" label="Proprietà" onChange={handleProp} disabled={showProp[0]}/>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <TextField id="filled-basic" label="Valore" variant="filled" onChange={handleValue} disabled={showProp[0]}/>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button variant="outlined" size="medium" color="primary" onClick={handlePropAdding}>Aggiungi</Button>
                    </p>

                    {(lastInserted>0)?
                    <p>
                        <TextField id="standard-basic" label="Proprietà" onChange={handleProp} disabled={showProp[1]}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <TextField id="filled-basic" label="Valore" variant="filled" onChange={handleValue} disabled={showProp[1]}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button variant="outlined" size="medium" color="primary" onClick={handlePropAdding}>Aggiungi</Button>
                    </p>
                        :<p></p>
                    }

                    {(lastInserted>1)?
                    <p>
                        <TextField id="standard-basic" label="Proprietà" onChange={handleProp} disabled={showProp[2]}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <TextField id="filled-basic" label="Valore" variant="filled" onChange={handleValue} disabled={showProp[2]}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button variant="outlined" size="medium" color="primary" onClick={handlePropAdding}>Aggiungi</Button>
                    </p>
                        :<p></p>
                    }

                    {(lastInserted>2)?

                        <p>
                            <TextField id="standard-basic" label="Proprietà" onChange={handleProp} disabled={showProp[3]}/>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <TextField id="filled-basic" label="Valore" variant="filled" onChange={handleValue} disabled={showProp[3]}/>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="outlined" size="medium" color="primary" onClick={handlePropAdding}>Aggiungi</Button>
                        </p>
                    :<p></p>
                    }

                    {(lastInserted>3)?
                        <p>
                            <TextField id="standard-basic" label="Proprietà" onChange={handleProp} disabled={showProp[4]}/>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <TextField id="filled-basic" label="Valore" variant="filled" onChange={handleValue} disabled={showProp[4]}/>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="outlined" size="medium" color="primary" onClick={handlePropAdding} disabled={true}>Aggiungi</Button>
                        </p>
                    :<p></p>
                    }

                    <p><Button variant="contained" onClick={backToCal}>Torna al calendario</Button></p>
                    <p><Button variant="contained" onClick={onSend}>Aggiungi evento</Button></p>
                </div>
        );
    }
}

export default FormClass;

