/* eslint-env browser */
import Domodule from 'domodule';
import Bequest from 'bequest';
import debounce from 'tinybounce';

export default class Complete extends Domodule {
  get showClass() {
    return this.options.showClass || 'show';
  }

  search(el, event, options) {
    const term = el.value;

    // Don't search for the just selected term
    if (term === this.selectedTerm) {
      return;
    }

    debounce(() => {
      const endpoint = options.endpoint || this.options.endpoint;
      const url = endpoint.replace(/\$\{term\}/g, term);

      Bequest.request(url, 'GET', {}, (err, resp) => {
        // @TODO: Do something with this?
        if (err) {
          return false;
        }

        this.render(resp.data);
      });
    }, this.options.delay || 1000);
  }

  render(results) {
    if (!Array.isArray(results)) {
      // @TODO: Maybe trigger an event or something
      return false;
    }

    let output = '';

    results.forEach(item => {
      let data = item;

      if (typeof data === 'string') {
        data = { value: data, name: data };
      }

      output += this.escape`<li data-action="select" data-action-value="${data.value}">${data.name}</li>`;
    });

    this.els.results.innerHTML = output;
    this.setupActions();
    this.els.resultsContainer.classList.add(this.showClass);
  }

  select(el, event, options) {
    this.selectedTerm = options.value;
    this.els.input.value = this.selectedTerm;
    this.els.resultsContainer.classList.remove(this.showClass);
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
}

Domodule.register(Complete);
