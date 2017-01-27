
import Complete from '../lib/complete';

import test from 'tape-rollup';

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
      <div data-name="resultsContainer">
        <ul data-name="results"></ul>
      </div>
    </div>
  `;
  const modules = Complete.discover();
  return modules;
};

init();

test('example module registerd', assert => {
  assert.equal(typeof Complete.modules, 'object');
  assert.equal(Object.keys(Complete.modules).length, 1, 'one module registered');
  assert.end();
});

test('search', assert => {
  const modules = setup();
  const instance = modules[0];

  setTimeout(() => {
    const elements = document.querySelectorAll('li');
    assert.equal(elements.length, 2, 'Correct number of elements rendered');
    assert.equal(elements[0].innerHTML, 'Test 1', 'First element correct');
    assert.equal(elements[0].dataset.action, 'select', 'Action setup');
    assert.equal(elements[0].dataset.actionValue, 'test1', 'Action value setup');
    assert.end();
  }, 100);

  instance.els.input.focus();
  page.sendEvent('keypress', 'a');
});

test('select', assert => {
  const modules = setup();
  const instance = modules[0];

  setTimeout(() => {
    const elements = document.querySelectorAll('li');
    const pos = elements[0].getBoundingClientRect();

    page.sendEvent('click', pos.left + pos.width / 2, pos.top + pos.height / 2);

    assert.equal(instance.els.input.value, 'test1', 'Value selected');
    assert.end();
  }, 100);

  instance.els.input.focus();
  page.sendEvent('keypress', 'a');
});
