import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
moment.locale('es')

const FACULTY_REGISTER_OPENS = moment('2017-01-27 00:00')
const FACULTY_REGISTER_CLOSE = moment('2017-02-01 23:59')
const DELEGATE_REGISTER_OPENS = moment('2017-02-02 00:00')
const DELEGATE_REGISTER_CLOSE = moment('2017-02-14 00:00')

const logo = require('../images/scifimun_logo.png')

const getCountdownState = (now, opens, closes) => {
  const nowTime = moment(now).unix()
  const openTime = moment(opens).unix()
  const closeTime = moment(closes).unix()

  switch (true) {
    case nowTime < openTime:
      return 'NOT_YET'
    case nowTime > closeTime:
      return 'CLOSED'
    case nowTime > openTime && nowTime < closeTime:
      return 'OPEN'
    default:
      return 'CLOSED'
  }
}

const Countdown = ({now, opens, closes, openMessage, notYetMessage, closedMessage}) => {

  let contents = null
  const countdownState = getCountdownState(now, opens, closes)
  switch (countdownState) {
    case 'NOT_YET':
      contents = <span className="text-info">{ `${notYetMessage} ${opens.fromNow()}!` }</span>
      break;
    case 'OPEN':
      contents = <div>
                   <span className="text-success">{ openMessage }</span><br/>
                   <br/><span>Fecha límite: { closes.format('LLL') }</span>
                 </div>
      break;
    case 'CLOSED':
      contents = <span className="text-danger">{ closedMessage }</span>
      break;
    default:
      break;
  }

  return (
    <div className="frow row-end">
      <h4 className="text-right">{ contents }</h4>
    </div>
  )
}

const Splash = () => {
  const now = moment.now()
  const facultyRegisterIsDisabled = getCountdownState(now, FACULTY_REGISTER_OPENS, FACULTY_REGISTER_CLOSE) !== 'OPEN'
  const delegateRegisterIsDisabled = getCountdownState(now, DELEGATE_REGISTER_OPENS, DELEGATE_REGISTER_CLOSE) !== 'OPEN'


  return (
    <div style={ { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
      <div className="container">
        <section
          className="jumbotron"
          style={ { display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
          <div style={ { display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
            <img
              src={ logo }
              style={ { maxHeight: 200 } } />
          </div>
          <h1>Scifimun Mexicup</h1>
          <div style={ { margin: '16px 0px', display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
            <Countdown
              now={ now }
              opens={ FACULTY_REGISTER_OPENS }
              closes={ FACULTY_REGISTER_CLOSE }
              openMessage={ 'Registros para faculties: abiertos' }
              closedMessage={ 'Registros para faculties: cerrados' }
              notYetMessage={ 'Registros para faculties: abren' } />
            <Countdown
              now={ now }
              opens={ DELEGATE_REGISTER_OPENS }
              closes={ DELEGATE_REGISTER_CLOSE }
              openMessage={ 'Registros para delegados: abiertos' }
              closedMessage={ 'Registros para faculties: cerrados' }
              notYetMessage={ 'Registros para delegados: abren' } />
          </div>
          <div style={ { display: 'flex', justifyContent: 'center', alignItems: 'center' } }>
            <div style={ { margin: 8 } }>
              <Link
                to="/faculties"
                className={ `reset btn btn-lg btn-primary ${facultyRegisterIsDisabled ? 'disabled': null}` }> Faculties
              </Link>
            </div>
            <div style={ { margin: 8 } }>
              <Link
                to="/delegates"
                className={ `reset btn btn-lg btn-primary ${delegateRegisterIsDisabled ? 'disabled': null}` }> Delegados
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Splash
