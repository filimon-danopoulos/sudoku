import './layout/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

import configureStore from './store';
import App from './presentation/App';
import pregenerate from './utils/pregenerate';
import { registerUpdate } from './utils/ServiceWorkerUpdated';

const store = configureStore();

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
serviceWorker.register();

if (process.env.NODE_ENV === 'development') {
  (window as any).pregenerate = pregenerate;
}

serviceWorker.register({
  onUpdate: () => {
    registerUpdate();
  }
});

window.addEventListener('load', function() {
  window.history.pushState({}, '');
});

window.addEventListener('popstate', function() {
  window.history.pushState({}, '');
});
