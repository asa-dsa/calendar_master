import React, {Component} from "react";


class Precondition extends Component{

    constructor(props) {
        super(props);
    }


    handlePre = () =>{
        console.log("Add pre")
    }

    backToCal = () =>{
        this.props.handlerViews(true)

    }


    render(){

        return(
            <div>
                Hi, I', the Pre class
                <p>
                <input type="submit" value="Aggiungi pre" onClick={this.handlePre} />
                <input type="submit" value="Torna indietro" onClick={this.backToCal} />
                </p>
            </div>
        )

    }

}
export default Precondition;