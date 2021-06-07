import React from 'react'

import { render } from 'react-dom'


import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/sass/styles.scss'

import CalendarPopup from './Components/CalendarPopup'


const EXAMPLES = {
    pop: 'Show more via a popup',
}

const DEFAULT_EXAMPLE = 'pop'

class Example extends React.Component {
    constructor(...args) {
        super(...args)

        this.state = {
            selected: DEFAULT_EXAMPLE,
        }
    }

    select = selected => {
        this.setState({ selected })
    }

    componentDidMount() {
        const hash = (window.location.hash || '').slice(1)
        this.select(hash || DEFAULT_EXAMPLE)
    }

    render() {
        let selected = this.state.selected
        let Current = {
            pop: CalendarPopup,
        }[selected]

        return (
            <div className="app">
                <div className="examples">
                    {/* <Card className="examples--header">
            <Layout
              align="center"
              justify="space-between"
              style={{ marginBottom: 15 }}
            >
              <div className="examples--view-source">
                <a target="_blank" href={demoRoot + '/' + selected + '.js'}>
                  <strong>
                    <i className="fa fa-code" />
                    {' View example source code'}
                  </strong>
                </a>
              </div>
              <Dropdown
                pullRight
                id="examples-dropdown"
                className="examples--dropdown"
              >
                <Dropdown.Toggle bsStyle="link" className="dropdown--toggle ">
                  {EXAMPLES[selected]}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {Object.entries(EXAMPLES).map(([key, title]) => (
                    <MenuItem
                      active={this.state.selected === key}
                      key={key}
                      href={`#${key}`}
                      onClick={() => this.select(key)}
                    >
                      {title}
                    </MenuItem>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Layout>
            <ExampleControlSlot.Outlet />
          </Card>*/}
                    <div className="example">
                        <Current/>
                    </div>
                </div>
            </div>
        )
    }
}

document.addEventListener('DOMContentLoaded', () => {
    render(<Example />, document.getElementById('app'))
})
