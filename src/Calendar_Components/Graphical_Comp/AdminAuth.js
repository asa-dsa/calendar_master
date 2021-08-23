import React, {Component} from "react";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Switch} from "pretty-checkbox-react";
import TextField from "@material-ui/core/TextField";

const getCal_uri ="/list_cal_owner"
const insertPre ="/auth_admin"
const getAdminPre_uri ="/list_admin_pre"
const deletePre_uri ="/delete_admin_pre"


const del_type = ["DELEGATO_ROOT", "DELEGATO_ADMIN"]
const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

class AdminAuth extends Component{

    constructor(args) {
        super(args);
        this.state = {
            calendar: [],
            repetition: false,
            showAuth: false,
            adminPre: []
        }
        this.getCalURL = this.props.uri + getCal_uri
        this.getAdminPreURL = this.props.uri + getAdminPre_uri
        this.insertAdminPre = this.props.uri + insertPre
        this.deletePreURL = this.props.uri + deletePre_uri

    }

    componentDidMount() {
        this.getCal()
        this.getPreAdmin()

    }


    getPreAdmin = () =>{
        let payload = { id: this.props.user};
        axios.post(this.getAdminPreURL, payload)
            .then(response => {
                this.setState({adminPre: response.data})
            })
            .catch(function (error) {
                console.log(error);
            });
    }



    addZero = (time) =>{
        return ((time<10?'0':'') + time).toString()
    }

    getTime = (auth) =>{
        if(auth.repetition ==="true"){
            const start_string = days[auth.startDay] + "." + auth.startHour + ":" + auth.startMin
            const end_string = days[auth.endDay] + "." +  auth.endHour + ":" + auth.endMin
            return start_string + " - " + end_string
        }
        else{
            const date_s = new Date(1000 * auth.start)
            const date_e = new Date(1000 * auth.end)
            const string_date_s = this.addZero(date_s.getDate()) + "/" + this.addZero(date_s.getMonth()) +  "/"+ date_s.getFullYear().toString() + "-" + this.addZero(date_s.getHours())+ ":" + this.addZero(date_s.getMinutes())
            const string_date_e = this.addZero(date_e.getDate()) + "/" + this.addZero(date_e.getMonth()) +  "/"+ date_e.getFullYear().toString() + "-" + this.addZero(date_e.getHours())+ ":" + this.addZero(date_e.getMinutes())
            return string_date_s + " - " + string_date_e
        }

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

    handleShow = () =>{
        this.setState({showAuth: !this.state.showAuth})
    }


    deleteAdminPre = (e) =>{
        const esito = (prompt("Sei sicuro di voler cancellare l'autorizzazione?", "No")).toUpperCase()
        if(esito === "SI") {
            let temp_id = (this.state.adminPre[e.target.value]._id)
            let pre_id = JSON.stringify(temp_id).replace(/['"]+/g, '').replace("{$oid:", "").replace("}", "")
            this.setState({pre_to_del: pre_id})
            let payload = ({"pre_id":pre_id})
            axios.post(this.deletePreURL, payload)
                .then(response => {
                    alert(response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
            this.backToCal()
            this.getPreAdmin()
        }else
            alert("Cancellazione annullata con successo")
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
                        (this.state.showAuth)?
                            <div>
                                {
                                    this.state.adminPre.map((item, index) => {
                                        return (
                                            <p>
                                                <MenuItem key={index} id={index} value={index} onClick={this.deleteAdminPre}>
                                                    Utente: {(item.user_id)}&nbsp; Calendario: {item.calendar_id}&nbsp;Timeslot: {this.getTime(item)} &nbsp; Ripetizione: {item.repetition}&nbsp; Livello: {item.level}
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
export default AdminAuth