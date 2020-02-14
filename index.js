/* eslint-env browser */
import Domodule from 'domodule';
import Bequest from 'bequest';
import debounce from 'tinybounce';
import { on, addClass, removeClass, find, fire } from 'domassist';

const DOMAssist = { on, addClass, removeClass, find };
const KEYS = {
  ENTER: 13,
  UP: 38,
  DOWN: 40
};

export default class Index extends Domodule {
  postInit() {
    this.currentIndex = -1;
    DOMAssist.on(this.els.input, 'keydown', event => this.keydown(event));
    DOMAssist.on(this.els.input, 'change', this.onChange.bind(this));
    this.fetch = debounce(this.fetch.bind(this), this.options.delay);
    this.options.strict = this.options.strict === true ||
        this.options.strict === 'true';
  }

  get defaults() {
    return {
      delay: 500,
      strict: true,
      showClass: 'show',
      highlightClass: 'selected'
    };
  }

  get required() {
    return {
      options: ['endpoint'],
      named: ['resultsContainer', 'input']
    };
  }

  search(el, event, options) {
    const term = `${el.value}`.trim();

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
    const url = this.endpoint.replace(/\$\{term\}/g, encodeURIComponent(this.term));

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
    this.updateValue({ value: options.value, name: el.innerHTML });
    this.els.resultsContainer.innerHTML = '';
  }

  updateValue(value) {
    this.selectedTerm = value;
    this.els.input.value = value.name;

    if (this.els.value) {
      this.els.value.value = value.value;
    }

    this.els.input.value = this.els.input.value.replace(/&amp;/g, '&')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/&#96;/g, '`');

    fire(this.els.input, 'change', { bubbles: true, detail: value });
  }

  onChange(event) {
    // Only allow the custom event being fired
    if (typeof event.detail === 'undefined') {
      event.stopImmediatePropagation();
    }
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
    const items = find('li', this.els.resultsContainer);

    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }

    if (this.currentIndex >= items.length) {
      this.currentIndex = items.length - 1;
    }

    DOMAssist.removeClass(items, this.options.highlightClass);
    DOMAssist.addClass(items[this.currentIndex], this.options.highlightClass);
  }

  selectItem() {
    const items = find('li', this.els.resultsContainer);

    if (this.currentIndex < 0) {
      if (this.options.strict) {
        this.currentIndex = 0;
      } else {
        this.updateValue({ value: this.els.input.value, name: this.els.input.value });
        return;
      }
    }

    if (this.currentIndex >= items.length) {
      this.currentIndex = items.length - 1;
    }

    items[this.currentIndex].click();
    DOMAssist.removeClass(items[this.currentIndex], this.options.highlightClass);
  }

  keydown(event) {
    switch (event.keyCode) {
      case KEYS.UP:
        if (this.currentIndex > 0) {
          --this.currentIndex;
        }

        this.highlightItem();

        break;
      case KEYS.DOWN:
        ++this.currentIndex;

        this.highlightItem();

        break;
      case KEYS.ENTER:
        this.selectItem();

        break;
      default:
        return;
    }

    event.preventDefault();
  }
}

Domodule.register('Complete', Index);
