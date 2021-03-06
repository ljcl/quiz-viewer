const { h, render } = require('preact');
const url2cmid = require('@abcnews/url2cmid');
const instances = document.querySelectorAll('[data-quiz]');
const meta = document.querySelector('meta[name=quiz]');
const quizzes = meta ? meta.getAttribute('content').split(',') : [];
const fastclick = require('fastclick');

// Polyfills
require('es6-object-assign/auto'); // Object.assign for IE

function init([idx, root]) {
  const App = require('./components');
  const id =
    root.dataset.quiz || quizzes[idx] || url2cmid(window.location.href);
  fastclick.attach(root);
  render(<App id={id} />, root, root.firstChild);
}

for (let i = 0; i < instances.length; ++i) {
  init([i, instances[i]]);
}

if (module.hot) {
  module.hot.accept('./components', () => {
    try {
      for (let i = 0; i < instances.length; ++i) {
        init([i, instances[i]]);
      }
    } catch (err) {
      const ErrorBox = require('./components/error-box');

      render(<ErrorBox error={err} />, root, root.firstChild);
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
  console.debug(`[quiz-viewer] public path: ${__webpack_public_path__}`);
}
