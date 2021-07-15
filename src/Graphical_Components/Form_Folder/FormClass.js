import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { CirclePicker } from 'react-color'
import axios from "axios";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const oneDayMs = 86400 * 1000
const getAllCal_uri = "/cal"


class FormClass extends Component{


    /*
    calendario, tipo, attr
     */
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            allDay: ((this.props.end - this.props.start) === oneDayMs),
            calendario: "",
            colore: "",
            tipo:"",
            startTime: this.props.start,
            endTime: this.props.end,
            posts:[],
            newCal: false
        }
        this.get_calendar_names_uri = this.props.uri + getAllCal_uri;

    }

    componentDidMount(){
        this.callServer();
    }

    callServer() {
        axios.get(this.get_calendar_names_uri)
            .then(response => {
                //console.log(response.data)
                this.setState({posts: response.data})
            })
            .catch(error =>{
                console.log(error);
            })
    }


    render() {
        let cal = []
        const {posts} = this.state;
        if(this.state.posts.length){
            posts.map((post, index) =>{
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
            this.setState({endTime: new Date(e.target.value)})

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
            handleSend()
        }

        const backToCal =() => {
            handleSend()
        }

        const updateDetails = (e) => {
            this.setState({dettagli: (e.target.value).toUpperCase()})
        }

        const handleColorChange = ({ hex }) => {
            this.setState({colore: hex})
        }

        let timezone_off = (new Date()).getTimezoneOffset() * 60000;//offset in milliseconds

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
                    <TextField
                        id="standard-multiline-static"
                        label="Ulteriori dettagli dell'evento"
                        multiline
                        rows={4}
                        defaultValue=""
                        onChange={updateDetails}
                    />
                    </p>
                    <p><Button variant="contained" onClick={backToCal}>Torna al calendario</Button></p>
                    <p><Button variant="contained" onClick={onSend}>Aggiungi evento</Button></p>

                </div>
        );
    }
}

export default FormClass;

