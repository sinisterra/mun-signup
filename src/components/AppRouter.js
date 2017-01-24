import React from 'react'
import { Router, Route, browserHistory } from 'react-router'

import Faculties from './Faculties'
import Delegates from './Delegates'
import Splash from './Splash'

const AppRouter = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Splash}/>
    <Route path="/faculties" component={Faculties}/>
    <Route path="/delegates" component={Delegates}/>
  </Router>
)

export default AppRouter
