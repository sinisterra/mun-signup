import React from 'react'
import Form from 'react-jsonschema-form'
import { map, merge, get, filter, sortBy, mapValues, values, every, reduce, includes, omit, forEach } from 'lodash'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import fetch from 'isomorphic-fetch'

const centerCenter = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}
const logo = require('../images/scifimun_logo.png')

const iconStyle = {
  maxHeight: 200,
  maxWidth: 200
}

const styles = {
  centerCenter,
  iconStyle,
  container: {
    minHeight: '100vh'
  }
}

const required = [
  'firstName',
  'lastName1',
  'lastName2',
  'email',
  'aboutTheEvent',
  'isIndependent'
]

const personalInformationSchema = {
  type: 'object',
  title: 'Datos Personales',
  required,
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
      title: 'Perfil de Facebook'
    },
    isIndependent: {
      type: 'string',
      default: 'true',
      title: '¿Perteneces a una delegación?',
      enum: ['false', 'true'],
      enumNames: ['Sí, pertenezco a una delegación', 'No, soy delegado independiente']
    },
    aboutTheEvent: {
      type: 'string',
      title: '¿Cómo te enteraste de SCIFIMUN?'
    }

  }
}

const facultyQuery = gql`
  {
    faculties {
      delegationName
      institution
    }
  }
`

const FacultyAdvisorSelect = graphql(facultyQuery)(
  ({data, isIndependent, onChange, facultyAdvisor}) => (
  Boolean(isIndependent) ?
    null :
    <div>
      <h3>Delegación</h3>
      <div className="form-group">
        Selecciona tu delegación
        <select
          className="form-control"
          value={ facultyAdvisor }
          onChange={ (e) => {
                       onChange(e.target.value)
                     } }>
          <option value="">
            ---
          </option>
          { map(sortBy((data.faculties || []), 'delegationName'), f => (
            <option value={ f.delegationName }>
              { `${f.delegationName} \n [${f.institution}]` }
            </option>
            )) }
        </select>
      </div>
    </div>
  )
)

const buildOptionSchema = (schema, optionType, optionData) => {

  return {}
}

const registerQuery = gql`
  {
    allCommittees {
      name
      questionnaire {
        id
        question
      }
      delegations {
        name
      }
    }
  }`

const delegationsQuery = gql`
  query ThisCommittee($committee: String!){
    committee(name: $committee){
      delegations {
        name
      }
    }
  }
`
const DelegationOptions = graphql(delegationsQuery, {
  options: ({committee}) => {
    return ({
      variables: {
        committee
      }
    })
  }
})(({data, label, selected, without, onChange, optionType, delegationType}) => {
  const delegations = get(data, 'committee.delegations') || []

  return (
    <div className="form-group">
      <label>
        { label }
      </label>
      <select
        className="form-control"
        onChange={ (e) => {
                     onChange({
                       signupOptions: {
                         [optionType]: {
                           [delegationType]: e.target.value
                         }
                       }
                     })
                   } }
        value={ selected }>
        <option value="">
          ---
        </option>
        { map(filter(delegations, d => d.name !== without && without !== ''), d => (
          <option
            value={ d.name }
            key={ d.name }>
            { d.name }
          </option>
          )) }
      </select>
    </div>
  )
})

const Questionnaire = ({questions, answers = {}, onChange}) => (
<div>
  <h4>Cuestionario</h4>
  { questions.length > 0 ?
    <div>
      { questions.map(({id, question}) => (
        <div className="form-group">
          <label htmlFor="">
            { question }
          </label>
          <textarea
            className="form-control"
            value={ get(answers, `${id}`) }
            onChange={ (event) => {
                         onChange({
                           id,
                           answer: event.target.value
                         })
                       } } />
        </div>
        )) }
    </div>
    :
    <div style={ styles.centerCenter }>
      <p>
        No hay cuestionario para este comité
      </p>
    </div> }
</div>
)


const SelectionOption = ({committees, without, selected, delegation1, delegation2, onChange, type, label}) => {



  const questions = get(get(filter(committees, c => c.name === selected.committee), '0') || {}, 'questionnaire') || []

  return (
    <div>
      <h3>{ label }</h3>
      <div className="form-group">
        <label>
          Comité
        </label>
        <select
          className="form-control"
          value={ get(selected, 'committee') || '' }
          onChange={ (e) => {
                       onChange({
                         signupOptions: {
                           [type]: {
                             committee: e.target.value,
                             delegation1: null,
                             delegation2: null,
                             answers: mapValues({
                               ...selected.answers
                             }, () => null)
                           }
                         }
                       })
                     } }>
          <option value="">
            ---
          </option>
          { map(filter(committees, c => c.name !== without && without !== ''), (c, i) => (
            <option
              value={ c.name }
              key={ i }>
              { c.name }
            </option>
            )) }
        </select>
      </div>
      <div className="row">
        <div className="col-md-12">
          { selected.committee && <DelegationOptions
                                    optionType={ type }
                                    onChange={ onChange }
                                    delegationType="delegation1"
                                    label="1° Representación"
                                    selected={ delegation1 }
                                    without={ delegation2 }
                                    committee={ selected.committee } /> }
          { selected.committee && <DelegationOptions
                                    optionType={ type }
                                    onChange={ onChange }
                                    delegationType="delegation2"
                                    label="2° Representación"
                                    selected={ delegation2 }
                                    without={ delegation1 }
                                    committee={ selected.committee } /> }
        </div>
        <div className="col-md-12">
          { selected.committee && <Questionnaire
                                    questions={ questions }
                                    onChange={ ({id, answer}) => {
                                                 onChange({
                                                   signupOptions: {
                                                     [type]: {
                                                       answers: {
                                                         [id]: answer
                                                       }
                                                     }
                                                   }
                                                 })
                                               } }
                                    answers={ selected.answers } /> }
        </div>
      </div>
      <hr/>
    </div>
  )
}

const RegisterOptions = graphql(registerQuery)(({data, optionType, signupOptions, onChange, committeeLabel}) => {
  const allCommittees = data.allCommittees || []
  const optionSchema = buildOptionSchema(optionSchema, optionType, signupOptions)

  const firstOption = get(signupOptions, 'firstOption') || {}
  const secondOption = get(signupOptions, 'secondOption') || {}



  return (
    <div>
      <SelectionOption
        type='firstOption'
        label="1° Opción de Comité"
        selected={ firstOption }
        onChange={ onChange }
        delegation1={ get(firstOption, 'delegation1') }
        delegation2={ get(firstOption, 'delegation2') }
        without={ secondOption.committee }
        committees={ allCommittees } />
      <SelectionOption
        type='secondOption'
        label="2° Opción de Comité"
        selected={ secondOption }
        without={ firstOption.committee }
        delegation1={ get(secondOption, 'delegation1') }
        delegation2={ get(secondOption, 'delegation2') }
        onChange={ onChange }
        committees={ allCommittees } />
    </div>
  )
})


class DelegateSignup extends React.Component {

  state = {
    dataIsValid: false,
    signupOptions: {
      firstOption: {

      },
      secondOption: {

      }
    },
    person: {
    },
    errors: []
  }

  validate = () => {
    const firstOptionIsValid = this.validateSingleOption(this.state, 'firstOption')
    const secondOptionIsValid = this.validateSingleOption(this.state, 'secondOption')
    const personalInformationIsValid = this.validatePerson(this.state)

    const errorObject = [
      personalInformationIsValid ? true : 'Revisa que toda tu información personal esté completa',
      firstOptionIsValid ? true : 'Revisa que todos los campos de tu primera opción estén completos',
      secondOptionIsValid ? true : 'Revisa que todos los campos de tu segunda opción estén completos'
    ]

    let errors = filter(errorObject, e => e !== true)

    this.setState({
      errors,
      dataIsValid: errors.length === 0
    })

    return filter(errorObject, e => e !== true)
  }

  validateSingleOption = (state, option) => {
    const thisOption = get(state, `signupOptions[${option}]`)
    const requiredFields = ['committee', 'delegation1', 'delegation2']

    for (let i in requiredFields) {
      const entryToCheck = get(thisOption, requiredFields[i])
      if (entryToCheck === undefined || entryToCheck === null || entryToCheck === "") {
        return false
      }
    }

    return true
  }

  validatePerson = (state) => {
    for (let i in required) {
      if (get(state.person, required[i]) === undefined) {
        return false
      }
    }

    return true
  }

  _handleChange = (changes) => {
    this.setState(merge({}, this.state, changes))
  }

  _handlePersonChange = ({formData}) => {

    this._handleChange({
      person: {
        ...formData,
        facultyAdvisor: formData.isIndependent === 'true' ? null : this.state.person.facultyAdvisor
      }
    })
  }

  _handleOptionChange = (type, optionData) => {
    this._handleChange({
      signupOptions: {
        [type]: {
          ...optionData
        }
      }
    })
  }

  submit = () => {
    this.setState({
      isSubmitting: true
    })

    const dataToSubmit = {
      ...this.state.person,
      ...this.state.signupOptions
    }

    fetch('/api/delegate', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSubmit)
    })
      .then(res => res.json())
      .then(() => {
        this.setState({
          submitted: true
        })
      })
  }


  render() {

    const {isSubmitting, signupOptions, person, errors} = this.state
    return (
      <div>
        <main
          className="container"
          style={ styles.container }>
          <section
            className="jumbotron row"
            style={ styles.centerCenter }>
            <img
              src={ logo }
              style={ styles.iconStyle } />
            <h1>Registro de Delegados</h1>
          </section>
          <section className="row">
            <section
              id="personal-information"
              className="col-md-10 col-md-offset-1">
              <Form
                schema={ personalInformationSchema }
                formData={ person }
                onChange={ this._handlePersonChange }>
                <div/>
              </Form>
            </section>
            <section
              id="delegation"
              className="col-md-10 col-md-offset-1">
              { person.isIndependent === 'false' && <FacultyAdvisorSelect
                                                      faculty={ get(this.state, 'person.facultyAdvisor') || null }
                                                      onChange={ (facultyAdvisor) => {
                                                                   this.setState({
                                                                     person: {
                                                                       ...this.state.person,
                                                                       facultyAdvisor
                                                                     }
                                                                   })
                                                                 } } /> }
              <RegisterOptions
                signupOptions={ signupOptions }
                onChange={ this._handleChange } />
            </section>
          </section>
          <section
            className="row"
            style={ { display: 'flex', flexDirection: 'column' } }>
            { errors.map(e => (
              <div>
                { e }
              </div>
              )) }
          </section>
          <section
            className="row"
            style={ { display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
            { this.state.dataIsValid === false ? <button
                                                   className="btn btn-primary btn-md"
                                                   onClick={ this.validate }>
                                                   Validar mis datos
                                                 </button> :
              <div>
                { !this.state.submitted ?
                  <div>

                    <h4 className="text-warning text-center" >
                    <span>

                    Tus datos han sido validados.
                    </span>
                    <br/>
                  <b>ATENCIÓN:  <span>Tu registro aún no se ha completado.<br/> Haz clic en el botón para enviar tu solicitud. </span>
                  </b>
                    </h4>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                  <button
                                            className="btn btn-success btn-lg text-center"
                                            onClick={ this.submit }>
                                            Confirmar mi registro
                                          </button>
                                          </div>
                    </div>
                                          :
                  <div>
                    <div className="well">
                    <h1 className="text-center text-success">Gracias por registrarte!</h1>
                    <p className="text-center">
                      Recibirás un correo electrónico en unos instantes confirmando tu registro.
                    </p>
                    <p className="text-center">
                      <a
                        href="https://www.facebook.com/SciFiMUN"
                        className="btn btn-primary">Síguenos en Facebook</a>
                    </p>
                  </div>
                  </div> }
              </div> }
          </section>
          <hr/>
        </main>
        <footer className="bg-primary">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                SCIFIMUN MEXICUP
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

export default DelegateSignup
