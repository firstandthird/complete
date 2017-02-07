
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
    <div data-module="Complete" data-module-endpoint="${testEndpoint}" data-module-highlight-class="complete-selected">
      <input type="text" data-name="input" data-action="search" data-action-type="input" placeholder="Search for something">
      <input type="hidden" data-name="value">
      <div data-name="resultsContainer"></div>
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
  }, 1000);

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

    assert.equal(instance.els.value.value, 'test1', 'Value selected');
    assert.end();
  }, 1000);

  instance.els.input.focus();
  page.sendEvent('keypress', 'a');
});

test('keyboard', assert => {
  const modules = setup();
  const instance = modules[0];

  setTimeout(() => {
    page.sendEvent('keypress', 16777237); //down
    page.sendEvent('keypress', 16777237);

    const elements = document.querySelectorAll('li');

    assert.ok(!elements[0].classList.contains('complete-selected'), 'Selected class removed');
    assert.ok(elements[1].classList.contains('complete-selected'), 'selected class added');

    page.sendEvent('keypress', 16777235); // up

    assert.ok(!elements[1].classList.contains('complete-selected'), 'Selected class removed');
    assert.ok(elements[0].classList.contains('complete-selected'), 'selected class added');

    page.sendEvent('keypress', 16777221); // enter

    assert.equal(instance.els.value.value, 'test1', 'Value selected');

    assert.ok(!elements[0].classList.contains('complete-selected'), 'Selected class removed');

    assert.end();
  }, 1000);

  instance.els.input.focus();
  page.sendEvent('keypress', 'a');
});
