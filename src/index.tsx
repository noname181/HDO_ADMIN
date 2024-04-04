import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
const sessionStorageTransfer = function (event: any) {
  if (!event) {
    event = window.event;
  } // ie suq
  if (!event.newValue) return; // do nothing if no value to work with
  if (event.key === 'getSessionStorage') {
    // another tab asked for the sessionStorage, send it
    localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
    // the other tab should now have it, so we're done with it.
    localStorage.removeItem('sessionStorage'); // could do short timeout as well.
  } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
    // another tab sent data <- get it
    const data = JSON.parse(event.newValue);
    for (const key in data) {
      sessionStorage.setItem(key, data[key]);
    }
  }
};

// listen for changes to localStorage
if (window.addEventListener) {
  window.addEventListener('storage', sessionStorageTransfer, false);
}

// Ask other tabs for session storage (this is ONLY to trigger event)
if (!sessionStorage.length) {
  localStorage.setItem('getSessionStorage', 'foobar');
  localStorage.removeItem('getSessionStorage');
}

root.render(
  <RecoilRoot>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </RecoilRoot>,
);
