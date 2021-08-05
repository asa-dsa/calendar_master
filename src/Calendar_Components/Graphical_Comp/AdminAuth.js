import React, {Component} from "react";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Switch} from "pretty-checkbox-react";
import TextField from "@material-ui/core/TextField";

const getCal_uri ="/list_cal_owner"
const insertPre ="/auth_admin"


const del_type = ["DELEGATO_ROOT", "DELEGATO_ADMIN"]
const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

class AdminAuth extends Component{

    constructor(args) {
        super(args);
        this.state = {
            calendar: [],
            repetition: false,
        }
        this.getCalURL = this.props.uri + getCal_uri
        this.insertAdminPre = this.props.uri + insertPre
    }

    componentDidMount() {
        this.getCal()
    }

    getCal = () =>{
        let payload = { id: this.props.user};
        axios.post(this.getCalURL, payload)
            .then(response => {
                this.setState({calendar: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleAdd = () =>{
        this.setState({showAdd: !this.state.showAdd})
    }






    updateDelType = (e) =>{
        this.setState({level: e.target.value})

    }

    backToCal = () =>{
        this.props.handlerViews(true)
    }


    handleRep = () =>{
        this.setState({repetition: !this.state.repetition})
    }


    render() {

        function replacer(key, value) {
            if (typeof value === 'number' || typeof value === 'boolean') {
                if(key === "start" || key ==="end")
                    return (value/1000).toString()
                return value.toString()
            }
            return value
        }


        const handleAdminAuth = () =>{
            console.log(this.state)
            let payload = {}
            if(this.state.repetition) {
                payload = {
                    creator: this.props.user,
                    calendar_id: this.state.calendar_id,
                    repetition: this.state.repetition,
                    startDay: this.state.startDay,
                    startHour: this.state.startHour,
                    startMin: this.state.startMin,
                    endDay: this.state.endDay,
                    endHour: this.state.endHour,
                    endMin: this.state.endMin,
                    level: this.state.level,
                    username: this.state.username
                }
            }else{
                payload = {
                    creator: this.props.user,
                    calendar_id: this.state.calendar_id,
                    repetition: this.state.repetition,
                    start: this.state.start,
                    end: this.state.end,
                    level: this.state.level,
                    username: this.state.username
                }
            }
            axios.post(this.insertAdminPre, JSON.stringify(payload, replacer))
                .then(response => {
                    alert(response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
            this.backToCal()


        }


        const updateStartDate = (e) => {
            this.setState({start: (new Date(e.target.value)).valueOf()})
        }

        const updateCal = (e) =>{
            let cal_id = JSON.stringify(e.target.value).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
            this.setState({calendar_id:  cal_id})
        }

        const updateEndDate = (e) => {
            this.setState({end: (new Date(e.target.value)).valueOf()})
        }

        const updateStartHour = (e) =>{
            let arr = (e.target.value).split(":")
            this.setState({startHour: arr[0]})
            this.setState({startMin: arr[1]})

        }

        const updateEndHour = (e) =>{
            let arr = (e.target.value).split(":")
            this.setState({endHour: arr[0]})
            this.setState({endMin: arr[1]})

        }

        const updateStartDay = (e) =>{
            this.setState({startDay: e.target.value})

        }

        const updateEndDay = (e) =>{
            this.setState({endDay: e.target.value})
        }

        const setName =(e) =>{
            this.setState({username: e.target.value})
        }


        return(
            <div>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Aggiungi admin auth" onClick={this.handleAdd} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Lista admin auth inserite" onClick={this.handleShow} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Torna indietro" onClick={this.backToCal} />
                </p>
                {
                    (this.state.showAdd) ?
                        <div>

                            <p>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <TextField
                                    label="Nome dell'utente"
                                    onChange={setName}
                                />
                            </p>


                            <p>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <label>Calendario</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Select
                                    onChange={updateCal}
                                    defaultValue={""}
                                >
                                    {
                                        this.state.calendar.map((item, index) => {
                                            return (
                                                <MenuItem key={index} id={index} value={item._id} onChange={updateCal}>
                                                    {item.type}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </p>

                            <p>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <label>Tipo di delega</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Select
                                    onChange={this.updateDelType}
                                    defaultValue={""}
                                >
                                    {
                                        del_type.map((item, index) => {
                                            return (
                                                <MenuItem key={index} id={index} value={item} onChange={this.updateDelType}>
                                                    {item}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </p>
                            <p>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Switch onChange={this.handleRep}>
                                    Ripetizione
                                </Switch>
                            </p>

                            {
                                !(this.state.repetition) ?
                                    <div>
                                        <p>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <TextField
                                                id="datetime-start"
                                                label="Data e ora di inizio della precondizione"
                                                type="datetime-local"
                                                defaultValue=""
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                onChange={updateStartDate}
                                            />
                                        </p>
                                        <p>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <TextField
                                                id="datetime-end"
                                                label="Data e ora di fine della precondizione"
                                                type="datetime-local"
                                                defaultValue=""
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                onChange={updateEndDate}
                                            />
                                        </p>
                                    </div>

                                    :

                                    <div>
                                        <p>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <label>Giorno di inizio</label>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <Select
                                                onChange={updateStartDay}
                                                defaultValue={""}
                                            >
                                                {
                                                    days.map((item, index) => {
                                                        return (
                                                            <MenuItem key={index} id={index} value={index}
                                                                      onChange={updateStartDay}>
                                                                {item}
                                                            </MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </p>

                                        <p>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <label>Giorno di fine</label>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <Select
                                                onChange={updateEndDay}
                                                defaultValue={""}
                                            >
                                                {
                                                    days.map((item, index) => {
                                                        return (
                                                            <MenuItem key={index} id={index} value={index}
                                                                      onChange={updateEndDay}>
                                                                {item}
                                                            </MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </p>

                                        <p>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <TextField
                                                id="timestart"
                                                label="Ora di inizio"
                                                type="time"
                                                defaultValue=""
                                                onChange={updateStartHour}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                            />
                                        </p>

                                        <p>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <TextField
                                                id="timeend"
                                                label="Ora fine"
                                                type="time"
                                                defaultValue=""
                                                onChange={updateEndHour}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                            />
                                        </p>

                                    </div>
                            }
                            <p>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="submit" value="Aggiungi pre" onClick={handleAdminAuth} />
                            </p>
                        </div>
                    :
                        <p></p>
                }

            </div>
        )
    }


}
export default AdminAuth