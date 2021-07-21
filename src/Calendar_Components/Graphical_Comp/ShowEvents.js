import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";

import {CirclePicker} from "react-color";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";


const noMoreProps = 9

class ShowEvents extends Component{

    constructor(props) {
        super(props);
        this.state = {
            event: this.props.event,
            view: true,
        }

    }

    render(){


        const backToCal =() => {
            this.props.handlerViews()
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
                            disabled={this.state.view}
                        />
                    </p>

                    <p>

                        <TextField
                            label="Nome del calendario"
                            defaultValue={this.state.event.calendar}
                            disabled={this.state.view}

                        />

                    </p>
                    <p>
                        <TextField
                            label="Tipo dell'evento"
                            defaultValue={this.state.event.type}
                            disabled={this.state.view}

                        />
                    </p>

                    <p>
                        <label>Colore associato all'evento</label>
                    </p>

                    <p>
                    <CirclePicker
                        color = {this.state.event.color}
                    />
                    </p>

                    <p>
                        <TextField
                            id="datetime-start"
                            label="Data e ora di inizio dell'evento"
                            type="datetime-local"
                            defaultValue={(new Date(this.state.event.start- timezone_off)).toISOString().slice(0,-1).substring(0,16)}
                            disabled={this.state.view}
                        />
                    </p>
                    <p>
                        <TextField
                            id="datetime-end"
                            label="Data e ora di fine dell'evento"
                            type="datetime-local"
                            defaultValue={(new Date(this.state.event.end- timezone_off)).toISOString().slice(0,-1).substring(0,16)}
                            disabled={this.state.view}

                        />
                    </p>

                    <p>
                        <label>Evento con durata giornaliera</label>
                        <Switch
                            defaultValue={this.state.event.allDay}
                            checked={this.state.event.allDay}
                            name="allDay"
                            disabled={this.state.view}
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
                                        <TextField id="standard-basic" label={key}  disabled={this.state.view}/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <TextField id="filled-basic" variant="filled" defaultValue={this.state.event[key]} disabled={this.state.view}/>
                                    </p>
                                )
                        })
                    }




                <p><Button variant="contained" onClick={backToCal}>Torna al calendario</Button></p>
                </div>

            </div>
        )

    }
}
export default ShowEvents;