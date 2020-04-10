import React from 'react';
import ReactDOM from 'react-dom';
import AuthenticationProvider from './context/auth-context'
import './index.css';
import App from './App';

ReactDOM.render(
    <AuthenticationProvider>
        <App />
    </AuthenticationProvider>,
    document.getElementById('root'));
