import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Switch} from "pretty-checkbox-react";

const getGroup_uri = "/list_created_group"
const getCal_uri ="/list_cal_owner"
const precond_uri ="/precondition"
const getpreuri ="/list_pre"
const deletepre ="/delete_pre"

const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

class Precondition extends Component{

    constructor(props) {
        super(props);
        this.state = {
            repetition: false,
            group: [],
            calendar: [],
            showAuth: false,
            showAdd: false
        }
        this.insertedGroup = this.props.uri + getGroup_uri;
        this.getCalURL = this.props.uri + getCal_uri;
        this.insertPre = this.props.uri + precond_uri;
        this.getAllPreURL =  this.props.uri + getpreuri;
        this.deletePre = this.props.uri + deletepre;

    }

    componentDidMount() {
        this.getGroup()
        this.getCal()
        this.getAllPre()
    }


    backToCal = () =>{
        this.props.handlerViews(true)
    }


    handleShow = () =>{
        this.setState({showAuth: !this.state.showAuth})

    }

    handleAdd = () =>{
        this.setState({showAdd: !this.state.showAdd})
    }

    getGroup = () =>{
        let payload = { id: this.props.user};
        axios.post(this.insertedGroup, payload)
            .then(response => {
                this.setState({group: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
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

    getAllPre = () =>{
        let payload = { id: this.props.user};
        axios.post(this.getAllPreURL, payload)
            .then(response => {
                this.setState({pre: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    getGroupName = (group_id) =>{
        let name = ""
        if(this.state.group.length){
            this.state.group.map((item, index) => {
                let id = JSON.stringify(item._id).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
                if(id === group_id) {
                    console.log(item.name)
                    name = item.name
                }
            })
        }
        return name
    }


    getCalName = (cal_id) =>{
        let name = ""
        if(this.state.calendar.length){
            this.state.calendar.map((item, index) => {
                let id = JSON.stringify(item._id).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
                if(id === cal_id) {
                    console.log(item.type)
                    name = item.type
                }
            })
        }
        return name
    }

    handleRep = () =>{
        this.setState({repetition: !this.state.repetition})
    }

    render(){
        const updateGroup = (e) =>{
            let group_id = JSON.stringify(e.target.value).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
            this.setState({group_id: group_id})
        }

        function replacer(key, value) {
            if (typeof value === 'number' || typeof value === 'boolean') {
                if(key === "start" || key ==="end")
                    return (value/1000).toString()
                return value.toString()
            }
            return value
        }

        const updateCal = (e) =>{
            let cal_id = JSON.stringify(e.target.value).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
            this.setState({calendar_id: cal_id})
        }


        const handlePre = () => {
            let payload = {}
            if(this.state.repetition) {
                payload = {
                    creator: this.props.user,
                    group_id: this.state.group_id,
                    calendar_id: this.state.calendar_id,
                    repetition: this.state.repetition,
                    startDay: this.state.startDay,
                    startHour: this.state.startHour,
                    startMin: this.state.startMin,
                    endDay: this.state.endDay,
                    endHour: this.state.endHour,
                    endMin: this.state.endMin
                }
            }else{
                payload = {
                    creator: this.props.user,
                    group_id: this.state.group_id,
                    calendar_id: this.state.calendar_id,
                    repetition: this.state.repetition,
                    start: this.state.start,
                    end: this.state.end,
                }
            }
            axios.post(this.insertPre, JSON.stringify(payload, replacer))
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

        const deletePre = (e) =>{
            const esito = (prompt("Sei sicuro di voler cancellare la precondizione?", "No")).toUpperCase()
            if(esito === "SI") {
                let temp_id = (this.state.pre[e.target.value]._id)
                let pre_id = JSON.stringify(temp_id).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
                this.setState({pre_to_del: pre_id})
                let payload = ({"pre_id":pre_id})
                axios.post(this.deletePre, payload)
                    .then(response => {
                        alert(response.data)
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                this.backToCal()
                this.getAllPre()
            }else
                alert("Cancellazione annullata con successo")
        }

        return(
            <div>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Aggiungi pre" onClick={this.handleAdd} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Lista pre inserite" onClick={this.handleShow} />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="submit" value="Torna indietro" onClick={this.backToCal} />
                </p>
                {
                    (this.state.showAdd) ?
                        <div>
                        <p>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <label>Nome del gruppo</label>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Select
                                onChange={updateGroup}
                                defaultValue={""}
                            >
                                {
                                    this.state.group.map((item, index) => {
                                        return (
                                            <MenuItem key={index} id={index} value={item._id} onChange={updateGroup}>
                                                {item.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </p>

                        <p>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <label>Nome del calendario</label>
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
                        <Switch onChange={this.handleRep}>
                        Ripetizione
                        </Switch>
                        </p>
                        {
                            !(this.state.repetition)?
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
                                <MenuItem key={index} id={index} value={index} onChange={updateStartDay}>
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
                                    <MenuItem key={index} id={index} value={index} onChange={updateEndDay}>
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
                                <p>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <input type="submit" value="Aggiungi pre" onClick={handlePre} />
                                </p>
                            </div>
                        }
                            </div>
                    :
                    (this.state.showAuth) ?
                        <div>
                            {
                                this.state.pre.map((item, index) => {
                                    return (
                                    <p>
                                    <MenuItem key={index} id={index} value={index} onClick={deletePre}>
                                        Gruppo: {this.getGroupName(item.group_id)}&nbsp; Calendario: {this.getCalName(item.calendar_id)}&nbsp;Timeslot: {item.timeslot}&nbsp; Ripetizione: {item.repetition}
                                    </MenuItem>
                                    </p>
                                )
                                })
                            }
                        </div>
                    :
                    <p></p>

                }
            </div>
        )

    }

}
export default Precondition;