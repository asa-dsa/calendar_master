import React from "react";
import CalendarPopup from "./Graphical_Components/CalendarPopup";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <h2> <center>Calendario AM - SS</center></h2>
            <BrowserRouter>
                <Switch>
                    <Route path="/calendar">
                        <CalendarPopup />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
