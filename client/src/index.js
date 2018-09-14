import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import registerServiceWorker from './registerServiceWorker';
import { makeMainRoutes } from './routes';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

const routes = makeMainRoutes();

ReactDOM.render(
  routes,
  document.getElementById('root')
);