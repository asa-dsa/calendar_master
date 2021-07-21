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
const getAllCal_uri = "/cal"



let showProp = new Array(maxProps);
let lastInserted = 0

class FormClass extends Component{


    /*
    calendario, tipo
     */
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            allDay: false,
            calendario: "",
            colore: "",
            tipo:"",
            startTime: this.props.start,
            endTime: this.props.end,
            calendar_names:[],
            newCal: false
        }
        this.prop_temp = ""
        this.value_temp = ""
        this.get_calendar_names_uri = this.props.uri + getAllCal_uri;
        for (let i=0; i<maxProps; i++)
            showProp[i] = false
        lastInserted = 0
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


    render() {
        let cal = []
        const {calendar_names} = this.state;
        if(this.state.calendar_names.length){
            calendar_names.map((post, index) =>{
                cal[index] = post.Type
            })
        }

        //use when send a message to return back to the calendar
        const handleSend = () => {
            this.props.handlerViews()
        }

        const updateStartDate = (e) => {
            this.setState({startTime: new Date(e.target.value)})
        }


        const updateEndDate = (e) => {
            let endDate = new Date(e.target.value)
            if(endDate-this.state.startTime >= oneDayMs || endDate <= this.state.startTime) {
                const tempTime = new Date(this.state.startTime);
                tempTime.setHours(23);
                tempTime.setMinutes(59)
                this.setState({endTime: tempTime})
                this.setState({error: true})
            }
            else
                this.setState({endTime: endDate})

        }

        const updateTitle = (e) => {
            this.setState({title: e.target.value})
        }

        const updateCal = (e) => {
            this.setState({calendario: e.target.value})
        }


        const updateType = (e) => {
            this.setState({tipo: (e.target.value).toUpperCase()})
        }

        const updateCheckBox = () => {
            this.setState({allDay : !this.state.allDay})
        }


        const onSend =() => {
            console.log(this.state)
            if(this.state.error)
                alert("Errore nell'inserimento della data di fine evento; data di fine evento impostata a " + this.state.endTime)
            handleSend()
        }

        const backToCal =() => {
            handleSend()
        }


        const handleColorChange = ({ hex }) => {
            this.setState({colore: hex})
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
                            <Select
                                onChange={updateCal}
                                defaultValue={""}
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
                            color = {this.state.colore}
                        />
                    </p>

                    <p>
                        <TextField
                            id="datetime-start"
                            label="Data e ora di inizio dell'evento"
                            type="datetime-local"
                            defaultValue={(new Date(this.props.start - timezone_off)).toISOString().slice(0,-1).substring(0,16)}
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
                            defaultValue={(new Date(this.props.end - timezone_off)).toISOString().slice(0,-1).substring(0,16)}
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

