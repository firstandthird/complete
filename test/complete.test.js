var completeSource = [
  'Acura', 'Audi', 'BMW', 'Cadillac',
  'Chrysler', 'Dodge', 'Ferrari', 'Ford',
  'GMC', 'Honda', 'Hyundai', 'Infiniti',
  'Jeep', 'Kia', 'Lexus', 'Mini',
  'Nissan', 'Porsche', 'Subaru', 'Toyota',
  'Volkswagon', 'Volvo'
];

function changeValueAndGetFirst (complete, completeDiv, value){
  complete.val(value);
  complete.trigger('keyup');
  return completeDiv.find('li').first();
}
function writeValue (complete, value) {
  complete.val(value);
  complete.trigger('keyup');
}

suite('complete', function() {
  var complete, fidelComplete, completeDiv, keyPress;

  suiteSetup(function(){
    complete = $('#autocomplete').complete({
      source : completeSource,
      delay: 0
    });
    fidelComplete = complete.data('complete');
    completeDiv = complete.next();
  });

  suite('init',function(){
    test('complete should exists in jQuery', function(){
      assert.equal(typeof $().complete, 'function');
    });
    test('complete should create a div in which results will be presented', function(){
      assert.equal(completeDiv.hasClass(fidelComplete.listClass), true);
    });
    test('complete should turn browser autocompletion off', function(){
      assert.equal(complete.attr('autocomplete'), 'off');
    });
    test('complete should store internal sources', function(){
      assert.equal(completeSource.length, fidelComplete.source.length);
    });
  });
  suite('suggestions', function(){
    test('complete should offer suggestions on keypress', function(){
      writeValue(complete,'a');
      assert.ok(completeDiv.find('li').length > 0);
    });
    test('complete shouldn\'t offer suggestions when value is not in source', function(){
      writeValue(complete,'z');
      assert.equal(completeDiv.find('li').length, 0);
    });
    test('suggestions should receive a special class on hover', function(){
      var firstLi = changeValueAndGetFirst(complete,completeDiv,'a');
      firstLi.trigger('mouseover');

      assert.ok(firstLi.hasClass(fidelComplete.suggestionActiveClass));
    });
    test('complete should keep track of which suggestion has been hovered', function(){
      var firstLi = changeValueAndGetFirst(complete,completeDiv,'a');
      firstLi.trigger('mouseover');

      assert.equal(firstLi.data('index'),fidelComplete.selectedIndex);
    });
    test('suggestions should remove the special class on mouseout', function(){
      var firstLi = changeValueAndGetFirst(complete,completeDiv,'a');
      firstLi.trigger('mouseover');
      firstLi.trigger('mouseout');

      assert.ok(!firstLi.hasClass(fidelComplete.suggestionActiveClass));
    });
    test('complete should keep track that suggestion has been unselected', function(){
      var firstLi = changeValueAndGetFirst(complete,completeDiv,'a');
      firstLi.trigger('mouseover');
      firstLi.trigger('mouseout');

      assert.equal(-1,fidelComplete.selectedIndex);
    });
    test('complete should use an alternate function if query parameter is passed', function(){
      var mockData = ['Andy','Arnold'],
          originalQuery = fidelComplete.query;

      fidelComplete.query = function(query,callback){
        callback.call(this, mockData);
      };
      writeValue(complete,'A');
      fidelComplete.query = originalQuery;
      assert.deepEqual(fidelComplete.suggestions, mockData);
    });
  });
  suite('key accesibility', function(){
    suiteSetup(function(){
      writeValue(complete,'a');
      keyPress = $.Event('keydown');
      keyPress.ctrlKey = false;
    });
    test('arrow down should select the next suggestion', function(){
      var currentSuggestion = fidelComplete.selectedIndex;
      keyPress.keyCode = fidelComplete.keyCode.DOWN;
      complete.trigger(keyPress);
      assert.equal(fidelComplete.selectedIndex, currentSuggestion+1);
    });
    test('arrow up should select the previous suggestion', function(){
      var currentSuggestion;
      keyPress.keyCode = fidelComplete.keyCode.DOWN;
      complete.trigger(keyPress);
      currentSuggestion = fidelComplete.selectedIndex;
      complete.trigger(keyPress);
      keyPress.keyCode = fidelComplete.keyCode.UP;
      complete.trigger(keyPress);

      assert.equal(fidelComplete.selectedIndex, currentSuggestion);
    });
    test('enter should change the value to the current selected suggestion', function(){
      keyPress.keyCode = fidelComplete.keyCode.DOWN;
      complete.trigger(keyPress);
      var suggestionValue = fidelComplete.suggestions[fidelComplete.selectedIndex];
      keyPress.keyCode = fidelComplete.keyCode.ENTER;
      complete.trigger(keyPress);
      assert.equal(complete.val(), suggestionValue);
    });
    test('enter should select the first value by default', function () {
      var suggestionValue = fidelComplete.suggestions[0];
      keyPress.keyCode = fidelComplete.keyCode.ENTER;
      complete.trigger(keyPress);
      assert.equal(complete.val(), suggestionValue);
    });
    test('escape should return the input to the default value', function(){
      complete.trigger('keyup');
      var esc = $.Event('keydown'),
          originalValue = complete.val();

      esc.keyCode = fidelComplete.keyCode.ESC;
      keyPress.keyCode = fidelComplete.keyCode.DOWN;

      complete.trigger(keyPress);
      complete.trigger(esc);

      assert.equal(complete.val(), originalValue);
    });
  });
  suite('events', function(){
    test('a \'select\' event should be fired when selecting a suggestion', function(done){
      var enter = $.Event('keydown'),
          down = $.Event('keydown');

      enter.keyCode = fidelComplete.keyCode.ENTER;
      down.keyCode = fidelComplete.keyCode.DOWN;

      complete.on('select',function(){
        done();
      });
      writeValue(complete,'b');
      complete.trigger(down);
      complete.trigger(enter);
    });
  });
  suite('source', function(){
    test('setSource should set this.source', function(){
      complete.complete('setSource', ['test', 'test2', 'America', 'France']);
      assert.equal(4, fidelComplete.source.length);
    });
  });
  suite('format', function(){
    setup(function(){
      writeValue(complete,'a');
      keyPress = $.Event('keydown');
      keyPress.ctrlKey = false;
    });
    test('output', function(){
      fidelComplete.format = function(val) {
        return val.toUpperCase();
      };

      keyPress.keyCode = fidelComplete.keyCode.DOWN;
      complete.trigger(keyPress);
      var suggestionValue = fidelComplete.suggestions[fidelComplete.selectedIndex];
      keyPress.keyCode = fidelComplete.keyCode.ENTER;
      complete.trigger(keyPress);
      assert.equal(complete.val(), suggestionValue.toUpperCase());
    });
  });
  suite('debounce', function(){
    setup(function(){
      keyPress = $.Event('keydown');
      keyPress.ctrlKey = false;
    });
    test('should only show after 10 ms', function(done){
      fidelComplete.delay = 10;
      completeDiv.find('li').remove();
      writeValue(complete, 'am');

      setTimeout(function(){
        assert.equal(completeDiv.find('li').length, 0);
      }, 1);

      setTimeout(function(){
        assert.ok(completeDiv.find('li').length > 0);
        done();
      }, 11);
    });
  });
});
