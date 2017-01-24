import React from 'react'
import Form from 'react-jsonschema-form'
import moment from 'moment'

moment.locale('es')

const SIGNUP_DEADLINE = moment('2017-02-02 00:00')
const SIGNUP_OPENS = moment('2017-01-27 00:00')

const logo = require('../images/logo.jpg')
import fetch from 'isomorphic-fetch'

const schema = {
  type: 'object',
  required: [],
  properties: {
    delegation: {
      type: 'object',
      title: 'Datos de la Delegación',
      properties: {
        delegationName: {
          type: 'string',
          title: 'Nombre de la delegación',
          description: 'Así te encontrarán tus delegados al registrarse'
        },
        institution: {
          type: 'string',
          title: 'Institución Educativa'
        },
        level: {
          type: 'string',
          title: 'Nivel',
          enum: ['media-superior', 'superior', 'posgrado'],
          enumNames: ['Media Superior', 'Superior', 'Posgrado'],
          default: 'superior'
        }
      }
    },
    person: {
      type: 'object',
      title: 'Datos Personales',
      properties: {
        firstName: {
          type: 'string',
          title: 'Nombre(s)'
        },
        lastName1: {
          type: 'string',
          title: 'Primer Apellido'
        },
        lastName2: {
          type: 'string',
          title: 'Segundo Apellido'
        },
        email: {
          type: 'string',
          format: 'email',
          title: 'Correo Electrónico'
        },
        mobile: {
          type: 'string',
          title: 'Teléfono Celular'
        },
        facebook: {
          type: 'string',
          format: 'uri',
          title: 'Perfil de Facebook'
        },
        aboutTheEvent: {
          type: 'string'
        }
      }
    }
  }
}

class Faculties extends React.Component {
  state = {
    formData: {}
  }

  onChange = ({formData}) => {
    this.setState({
      formData
    })
  }

  onSubmit = ({formData}) => {

    fetch('/api/faculty', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(json => {
      console.log(json)
      this.setState({
        submitted: true
      })
    })

  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <section className="jumbotron row">
                <div style={ { display: 'flex', justifyContent: 'center' } }>
                  <img
                    src={ logo }
                    style={ { maxHeight: 200, maxWidth: 200 } } />
                </div>
                <h2 className="text-center">Registro de Faculties</h2>
                <div className="text-center">
                  <dl className="dl-horizontal">
                    <dt style={ { width: 320, paddingRight: 10 } }>Apertura del Registro:</dt>
                    <dd>
                      { `${SIGNUP_OPENS.format('LL')}` }
                    </dd>
                    <dt style={ { width: 320, paddingRight: 10 } }>Fecha Límite:</dt>
                    <dd>
                      { `${SIGNUP_DEADLINE.format('LL')} ( ${SIGNUP_DEADLINE.fromNow()} )` }
                    </dd>
                  </dl>
                </div>
              </section>
              <div className="row">
                { !this.state.submitted ?
                  <div className="col-md-12">
                    <Form
                      schema={ schema }
                      uiSchema={ { person: { aboutTheEvent: { 'ui:widget': 'textarea' } } } }
                      onChange={ this.onChange }
                      onSubmit={ this.onSubmit }
                      formData={ this.state.formData }>
                      <div style={ { display: 'flex', justifyContent: 'flex-end' } }>
                        <button
                          type="submit"
                          className="btn btn-md btn-primary reset">
                          Enviar datos
                        </button>
                      </div>
                    </Form>
                  </div> :
                  <div className="well">
                    <h1 className="text-center">Gracias por registrarte!</h1>
                    <p className="text-center">
                      Recibirás un correo electrónico en unos instantes confirmando tu registro.
                    </p>
                    <p className="text-center">
                      <a
                        href="https://www.facebook.com/SciFiMUN"
                        className="btn btn-primary">Síguenos en Facebook</a>
                    </p>
                  </div> }
              </div>
            </div>
          </div>
        </div>
        <footer
          className="bg-primary"
          style={ { marginTop: 16, padding: 16 } }>
          <div className="container">
            <div className="row">
              <div className="col-md-10 col-md-offset-1">
                <div className="row">
                  <div className="col-md-6">
                    SCIFIMUN 2016
                  </div>
                  <div className="col-md-6">
                    Hello!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

export default Faculties
