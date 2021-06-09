import React from 'react'
import {Switch} from "pretty-checkbox-react";
import 'pretty-checkbox/src/pretty-checkbox.scss'


/*
function getCalendar ()  {
    fetch("http://192.168.178.63:8080/")
        .then(response => response.json())
        .then(
            (response)=>{this.setState({"response":response});},
            (error)=>{this.setState({"response":error.message});}
        );
    console.log(this.state.response)
}

function Header({calendars}) {
    const cal = ['lavoro', 'mi sego', 'home'];
    const calNumber = [...Array(cal.length)];

    const handleChange = event => {
        if(!calNumber[event.target.id]) {
            console.log(event.target.value)
            calNumber[event.target.id] = true;
        }
        else {
            calNumber[event.target.id] = false;
            console.log("Non " + event.target.value);
        }
    };

    return (
        <>
            {
                cal.map((item, index) => {
                    return(
                    <Switch key= {index} id={index} value={item} onChange={getCalendar}>
                        {item}
                    </Switch>
                    )
                })
            }
        </>
    )
}

export default Header;
*/