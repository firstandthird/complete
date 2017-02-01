/* eslint-env browser */
import Domodule from 'domodule';
import Bequest from 'bequest';
import debounce from 'tinybounce';
import { on, addClass, removeClass, toArray, find } from 'domassist';

export default class Complete extends Domodule {
  postInit() {
    this.currentIndex = -1;
    on(this.els.input, 'keyup', event => this.keyup(event));
    this.fetch = debounce(this.fetch.bind(this), this.options.delay || 500);
  }

  search(el, event, options) {
    const term = el.value;

    // Don't search for the just selected term
    if (term === this.selectedTerm) {
      return;
    }
    this.term = term;
    this.endpoint = options.endpoint || this.options.endpoint;
    this.listClass = options.listClass || this.options.listClass;
    this.fetch();
  }

  fetch() {
    const url = this.endpoint.replace(/\$\{term\}/g, this.term);

    Bequest.request(url, 'GET', {}, (err, resp) => {
      // @TODO: Do something with this?
      if (err) {
        return false;
      }

      this.currentIndex = -1;
      this.render(resp.data);
    });
  }

  render(results) {
    if (!Array.isArray(results)) {
      // @TODO: Maybe trigger an event or something
      return false;
    }

    let extra = '';

    if (this.listClass) {
      extra += ` class="${this.listClass}"`;
    }

    let output = `<ul${extra}>`;

    results.forEach(item => {
      let data = item;

      if (typeof data === 'string') {
        data = { value: data, name: data };
      }

      output += this.escape`<li data-action="select" data-action-value="${data.value}">${data.name}</li>`;
    });

    output += '</ul>';

    this.els.resultsContainer.innerHTML = output;
    this.setupActions();
  }

  select(el, event, options) {
    this.selectedTerm = { value: options.value, name: el.innerHTML };
    this.els.input.value = this.selectedTerm.name;
    this.els.value.value = this.selectedTerm.value;
  }

  escape(strings, ...vals) {
    let output = '';

    strings.forEach((str, i) => {
      output += str;

      if (typeof vals[i] === 'string') {
        output += vals[i].replace(/&/g, '&amp;')
                         .replace(/>/g, '&gt;')
                         .replace(/</g, '&lt;')
                         .replace(/"/g, '&quot;')
                         .replace(/'/g, '&#39;')
                         .replace(/`/g, '&#96;');
      }
    });

    return output;
  }

  highlightItem() {
    const items = toArray(find('li', this.els.resultsContainer));

    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }

    if (this.currentIndex >= items.length) {
      this.currentIndex = items.length - 1;
    }

    items.forEach(item => {
      removeClass(item, this.options.highlightClass);
    });

    addClass(items[this.currentIndex], this.options.highlightClass);
  }

  selectItem() {
    const items = find('li', this.els.resultsContainer);

    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }

    if (this.currentIndex >= items.length) {
      this.currentIndex = items.length - 1;
    }

    items[this.currentIndex].click();
    removeClass(items[this.currentIndex], this.options.highlightClass);
  }

  keyup(event) {
    switch (event.keyCode) {
      case 38: // ArrowUp
        if (this.currentIndex > 0) {
          --this.currentIndex;
        }

        this.highlightItem();

        break;
      case 40: // ArrowDown
        ++this.currentIndex;

        this.highlightItem();

        break;
      case 13: // Enter
        this.selectItem();

        break;
      default:
        return;
    }

    event.preventDefault();
  }
}

Domodule.register(Complete);
