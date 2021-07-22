import React, {Component} from "react";


class Authorization extends Component{

    constructor(props) {
        super(props);
    }


    handleAddAuth = () =>{
        console.log("Add auth")
    }

    backToCal = () =>{
        this.props.handlerViews(true)

    }


    render(){

        return(
            <div>
                Hi, I', the Auth class
                <p>
                <input type="submit" value="Aggiungi auth" onClick={this.handleAddAuth} />
                <input type="submit" value="Torna indietro" onClick={this.backToCal} />
                </p>
            </div>
        )

    }

}

export default Authorization;