import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Switch} from "pretty-checkbox-react";

const getGroup_uri = "/list_created_group"

class Precondition extends Component{

    constructor(props) {
        super(props);
        this.state = {
            repetition: false,
            start:(new Date()).valueOf(),
            end: (new Date()).valueOf(),
            group: []
        }
        this.insertedGroup = this.props.uri + getGroup_uri;

    }

    componentDidMount() {
        this.getGroup()
    }


    backToCal = () =>{
        this.props.handlerViews(true)
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

    handleRep = () =>{
        this.setState({repetition: !this.state.repetition})
    }

    render(){
        const updateGroup = (e) =>{
            this.setState({group_id: e.target.value})
        }

        function replacer(key, value) {
            if (typeof value === 'number' || typeof value === 'boolean') {
                if(key === "start" || key ==="end")
                    return (value/1000).toString()
                return value.toString()
            }
            return value
        }

        const updateCal = () =>{

        }


        const handlePre = () => {
            let payload = ""
            JSON.stringify(payload, replacer)

        }

        const updateStartDate = (e) => {
            this.setState({start: (new Date(e.target.value).valueOf)})
        }

        const updateEndDate = (e) => {
            this.setState({end: (new Date(e.target.value).valueOf)})
        }


        return(
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
                        /*this.state.group.map((item, index) => {
                            return (
                                <MenuItem key={index} id={index} value={item._id} onChange={updateCal}>
                                    {item.name}
                                </MenuItem>
                            )
                        })*/
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
                                defaultValue={(new Date()).toISOString().slice(0,-1).substring(0,16)}
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
                                defaultValue={(new Date()).toISOString().slice(0,-1).substring(0,16)}
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
                        <label>Giorno di fine</label>
                        </p>
                        <p>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <label>Ora di inizio</label>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <label>Ora di fine</label>
                        </p>
                    </div>
                }


                &nbsp;&nbsp;&nbsp;&nbsp;

                <p>
                <input type="submit" value="Aggiungi pre" onClick={handlePre} />
                <input type="submit" value="Torna indietro" onClick={this.backToCal} />
                </p>
            </div>
        )

    }

}
export default Precondition;