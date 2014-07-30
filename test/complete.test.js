var completeSource = [
  'Acura', 'Audi', 'BMW', 'Cadillac',
  'Chrysler', 'Dodge', 'Ferrari', 'Ford',
  'GMC', 'Honda', 'Hyundai', 'Infiniti',
  'Jeep', 'Kia', 'Lexus', 'Mini',
  'Nissan', 'Porsche', 'Subaru', 'Toyota',
  'Volkswagon', 'Volvo'
    ],
    completeObjectSource = [
      {
        name: 'Acura',
        country: 'Japan'
      },
      {
        name: 'Audi',
        country: 'Germany'
      },
      {
        name: 'BMW',
        country: 'Germany'
      },
      {
        name: 'Cadillac',
        country: 'USA'
      },
      {
        name: 'Chrysler',
        country: 'USA'
      },
      {
        name: 'Dodge',
        country: 'USA'
      },
      {
        name: 'Ferrari',
        country: 'Italy'
      },
      {
        name: 'Ford',
        country: 'USA'
      },
      {
        name: 'GMC',
        country: 'USA'
      },
      {
        name: 'Honda',
        country: 'Japan'
      },
      {
        name: 'Hyundai',
        country: 'South Korea'
      },
      {
        name: 'Infiniti',
        country: 'Japan'
      },
      {
        name: 'Jeep',
        country: 'USA'
      },
      {
        name: 'Kia',
        country: 'South Korea'
      },
      {
        name: 'Lexus',
        country: 'Japan'
      },
      {
        name: 'Mini',
        country: 'United Kingdom'
      },
      {
        name: 'Nissan',
        country: 'Japan'
      },
      {
        name: 'Porsche',
        country: 'Germany'
      },
      {
        name: 'Subaru',
        country: 'Japan'
      },
      {
        name: 'Toyota',
        country: 'Japan'
      },
      {
        name: 'Volkswagen',
        country: 'Germany'
      },
      {
        name: 'Volvo',
        country: 'Swedish'
      }
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

  setup(function(){
    complete = $('#autocomplete').complete({
      source : completeSource,
      delay: 0,
      sourceKey: 'name'
    });
    fidelComplete = complete.data('complete');
    completeDiv = complete.next();
  });
  teardown(function () {
    complete.complete('destroy');
    complete = null;
    fidelComplete = null;
    completeDiv = null;
    $('#fixture').empty().html('<input type="text" id="autocomplete">');
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
    test('complete should offer suggestions on click', function(){
      complete.trigger('click');

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
    setup(function(){
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
      var currentSuggestion,
          down = $.Event('keydown'),
          down2 = $.Event('keydown'),
          up = $.Event('keydown');

      down.keyCode = fidelComplete.keyCode.DOWN;
      down2.keyCode = fidelComplete.keyCode.DOWN;
      up.keyCode = fidelComplete.keyCode.UP;

      complete.trigger(down);
      currentSuggestion = fidelComplete.selectedIndex;
      complete.trigger(down2);
      keyPress.keyCode = fidelComplete.keyCode.UP;
      complete.trigger(up);

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
		test('enter should not fire a new query', function () {
			var called = false;

			fidelComplete.query = function () {
				called = true;
			};
			keyPress.keyCode = fidelComplete.keyCode.ENTER;
			assert.equal(called, false);
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
  suite('allowOthers', function () {
    setup(function () {
      fidelComplete.allowOthers = true;
      writeValue(complete,'a');
      keyPress = $.Event('keydown');
      keyPress.ctrlKey = false;
    });
    test('should accept other values if allowOthers is true', function () {
      keyPress = $.Event('keydown');
      keyPress.ctrlKey = false;
      keyPress.keyCode = fidelComplete.keyCode.ENTER;
      complete.trigger(keyPress);
      assert.equal(complete.val(), 'a');
    });
    test('Should allow to pick suggestion as well', function () {
      var down = $.Event('keydown'),
          enter = $.Event('keydown');

      down.keyCode = fidelComplete.keyCode.DOWN;
      enter.keyCode = fidelComplete.keyCode.ENTER;
      complete.trigger(down);
      complete.trigger(enter);

      assert.equal(complete.val(), fidelComplete.suggestions[fidelComplete.selectedIndex]);
    });
    test('Should get the full object in case the full suggestion has been introduced', function () {
      complete.complete('setSource', completeObjectSource);
      writeValue(complete,'Acura');
      var enter = $.Event('keydown');
      enter.keyCode = fidelComplete.keyCode.ENTER;
      complete.trigger(enter);
      assert.deepEqual(fidelComplete.currentValue, completeObjectSource[0]);
    });
    teardown(function () {
      fidelComplete.allowOthers = false;
    });
  });
  suite('events', function(){
    test('a \'select\' event should be fired when selecting a suggestion', function(done){
      var enter = $.Event('keydown'),
          down = $.Event('keydown');

      enter.keyCode = fidelComplete.keyCode.ENTER;
      down.keyCode = fidelComplete.keyCode.DOWN;

      complete.on('complete:select',function(){
        done();
      });
      writeValue(complete,'b');
      complete.trigger(down);
      complete.trigger(enter);
    });
    test('The \'select\' event will have the full object in case an array of objects has been provided', function (done) {
      var expectedResult = completeObjectSource[0];
      var enter = $.Event('keydown'),
          down = $.Event('keydown');

      enter.keyCode = fidelComplete.keyCode.ENTER;
      down.keyCode = fidelComplete.keyCode.DOWN;

      complete.on('complete:select',function(e, val){
        assert.deepEqual(val, expectedResult);
        done();
      });

      complete.complete('setSource', completeObjectSource);
      writeValue(complete,'A');

      complete.trigger(down);
      complete.trigger(enter);
    });
    test('a \'query\' event should be fired when a query is made', function(done){
      var enter = $.Event('keydown'),
          down = $.Event('keydown');

      enter.keyCode = fidelComplete.keyCode.ENTER;
      down.keyCode = fidelComplete.keyCode.DOWN;

      complete.on('complete:select',function(e, val){
        done();
      });

      complete.complete('setSource', completeObjectSource);
      writeValue(complete,'A');

      complete.trigger(down);
      complete.trigger(enter);
    });
  });
  suite('source', function(){
    test('setSource should set this.source', function(){
      complete.complete('setSource', ['test', 'test2', 'America', 'France']);
      assert.equal(4, fidelComplete.source.length);
    });
    test('We should be able to pass an array of objects as a source', function () {
      var expectedResult = completeObjectSource[0];

      complete.complete('setSource', completeObjectSource);
      writeValue(complete,'A');
      keyPress = $.Event('keydown');
      keyPress.ctrlKey = false;
      keyPress.keyCode = fidelComplete.keyCode.ENTER;
      complete.trigger(keyPress);

      assert.equal(complete.val(), expectedResult.name);
      assert.deepEqual(fidelComplete.currentValue, expectedResult);
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
      writeValue(complete, 'Ac');

      setTimeout(function(){
        assert.equal(completeDiv.find('li').length, 0);
      }, 1);

      setTimeout(function(){
        assert.ok(completeDiv.find('li').length > 0);
        done();
      }, 11);
    });
  });
  suite('keepOpen', function(){
    test('should stay open when clicking outside', function(){
      fidelComplete.keepOpen = true;
      complete.trigger('click');

      assert.ok(completeDiv.find('li').length > 0);

      $(document).trigger('click.complete');

      assert.equal(completeDiv.css('display'), 'block');
    });
  });
});
