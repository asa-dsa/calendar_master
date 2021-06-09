import React from 'react'

import { render } from 'react-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/sass/styles.scss'

import CalendarPopup from "./Graphical_Components/CalendarPopup";


class Example extends React.Component {
    constructor(...args) {
        super(...args)

    }

    componentDidMount() {
        const hash = (window.location.hash || '').slice(1)
        this.select(hash)
    }

    render() {
        return (
            <div className="app">
                <div className="examples">
                    <div className="example">
                        <CalendarPopup/>
                    </div>
                </div>
            </div>
        )
    }
}

document.addEventListener('DOMContentLoaded', () => {
    render(<Example />, document.getElementById('app'))
})
