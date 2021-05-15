import './layout/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

import configureStore from './store';
import App from './presentation/App';
import pregenerate from './utils/pregenerate';
import { registerUpdate } from './utils/ServiceWorkerUpdated';
import { toggleExitPrompt } from './store/actions';

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
  },
});

window.addEventListener('load', () => {
  window.history.pushState({}, '');
});

window.addEventListener('popstate', e => {
  store.dispatch(toggleExitPrompt());
});

window.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    localStorage.setItem('hidden-at', Date.now().toString());
  } else {
    const hiddenAt = +(localStorage.getItem('hidden-at') || 0);
    const hiddenFor = +(localStorage.getItem('hidden-for') || 0);
    localStorage.setItem('hidden-for', (hiddenFor + Date.now() - hiddenAt).toString());
    localStorage.removeItem('hidden-at');
  }
});
