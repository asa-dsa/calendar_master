import {Switch} from "pretty-checkbox-react";
import React, {Component} from "react";

class Form extends Component{

    constructor(props) {
        super(props);
    }

    render() {

        const handleSend = () => {
            this.props.handlerViews()
        }

        return (
            <Switch onChange={handleSend}>
                Test Send
            </Switch>
        )
    }
}

export default Form;
