import React, {Component} from "react";
import {Form, SubmitField, CheckboxField} from 'react-components-form';
import DateTimePicker from 'react-datetime-picker';
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";

const oneDayMs = 86400 * 1000


class FormClass extends Component{


    /*
    title, calendario, colore, allday, start, end, tipo
     */
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            allDay: false,
            colore: "",
            tipo:"",
            startTime: this.props.start,
            endTime: this.props.end
        }
    }


    render() {


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


        const updateCheckBox = (e) => {
            this.setState({allDay : !this.state.allDay})
        }

        const onSend =(model) => {
            this.setState({title: model.title})
            console.log(this.state)
            //handleSend()
        }


        let timezone_off = (new Date()).getTimezoneOffset() * 60000;//offset in milliseconds

        return (
            <Form
                onSubmit={onSend}
                onError={(errors, data) => console.log('error', errors, data)}
            >

                <TextField
                    label="Titolo dell'evento"
                    onChange={updateTitle}
                />

                <div>
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
                </div>

                <div>
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
                </div>

                <Switch
                    checked={this.state.allDay}
                    onChange={updateCheckBox}
                    label="Evento giornaliero"
                    name="allDay"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />

                <SubmitField value="Submit" />
            </Form>
        );
    }
}

export default FormClass;

