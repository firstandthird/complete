
import 'core-js';
import Domodule from '../lib/complete';

import { test } from 'tape';

const testEndpoint = './test/autocomplete.json';

const page = window.phantom.page;

const init = () => {
  const container = document.createElement('div');
  container.id = 'domodule';
  document.body.appendChild(container);
};

const setup = () => {
  const container = document.getElementById('domodule');
  container.innerHTML = `
    <div data-module="Complete" data-module-endpoint="${testEndpoint}">
      <input type="text" data-name="input" data-action="search" data-action-type="input" placeholder="Search for something">
      <div data-name="results-container">
        <ul data-name="results"></ul>
      </div>
    </div>
  `;
  const modules = Domodule.discover();
  return modules;
};

init();

test('example module registerd', assert => {
  assert.equal(typeof Domodule.modules, 'object');
  assert.equal(Object.keys(Domodule.modules).length, 1, 'one module registered');
  assert.end();
});

test('search', assert => {
  const modules = setup();
  const instance = modules[0];

  setTimeout(() => {
    assert.end();
  }, 500);

  instance.els.input.focus();
  page.sendEvent('keypress', 'a');
});
