import React from 'react'
import moment from 'moment'

const DELEGATE_REGISTER_OPENS = moment('2017-02-02 00:00').unix()
const DELEGATE_REGISTER_CLOSE = moment('2017-02-14 00:00').unix()


import DelegateSignup from './DelegateSignup'

class Delegates extends React.Component {

  render() {
    const now = moment().unix()
    const registerIsOpen = now > DELEGATE_REGISTER_OPENS && now < DELEGATE_REGISTER_CLOSE || true
    return registerIsOpen ? (<div>
                               <DelegateSignup/>
                             </div>) : (
      <div style={ { display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height: '100vh' } }>
        <h1 className="text-center">Los registros no están disponibles.</h1>
        <a
          href="https://www.facebook.com/SciFiMUN"
          className="btn btn-primary text-center">Síguenos en Facebook</a>
      </div>
      )
  }
}

export default Delegates
