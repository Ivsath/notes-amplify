import './styles/index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import Amplify from 'aws-amplify'

import reportWebVitals from './reportWebVitals'
import config from './aws-exports'
import App from './components/App'

Amplify.configure(config)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
