import React, {Component} from "react";
import {Form, SubmitField, CheckboxField} from 'react-components-form';
import DateTimePicker from 'react-datetime-picker';
import TextField from "@material-ui/core/TextField";

const oneDayMs = 86400 * 1000


class FormClass extends Component{

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            allDay: false,
            startTime: this.props.start,
            endTime: this.props.end
        }
        this.allDay= Boolean((this.props.end - this.props.start) === oneDayMs)

    }


    render() {


        //use when send a message to return back to the calendar
        const handleSend = () => {
            this.props.handlerViews()
        }

        const updateStartDate = (e) => {
            this.setState({startTime: e})
        }


        const updateEndDate = (e) => {
            this.setState({endTime: e})
        }

        const updateTitle = (e) => {
            this.setState({title: e.target.value})
        }


        const updateCheckBox = (e) => {
            this.setState({allDay : e})
        }

        const onSend =(model) => {
            this.setState({title: model.title})
            console.log(this.state)
            //handleSend()
        }

        return (
            <Form
                onSubmit={onSend}
                onError={(errors, data) => console.log('error', errors, data)}
            >

                <TextField
                    label="Titolo dell'evento"
                    onChange={updateTitle}
                />

                <CheckboxField name="allDay" label="Evento giornaliero" value={this.state.allDay} onChange={updateCheckBox}/>

                <div>
                    <label>Data e ora di inizio dell'evento </label>
                    <DateTimePicker
                        name="starTime"
                        onChange={updateStartDate}
                        value={this.state.startTime}
                    />
                </div>
                <div>
                    <label>Data e ora di fine dell'evento </label>
                    <DateTimePicker
                        name="endTime"
                        onChange={updateEndDate}
                        value={this.state.endTime}
                    />
                </div>
                <SubmitField value="Submit" />
            </Form>
        );
    }
}

export default FormClass;

