var autocompleteSource = [
  'Acura', 'Audi', 'BMW', 'Cadillac',
  'Chrysler', 'Dodge', 'Ferrari', 'Ford',
  'GMC', 'Honda', 'Hyundai', 'Infiniti',
  'Jeep', 'Kia', 'Lexus', 'Mini',
  'Nissan', 'Porsche', 'Subaru', 'Toyota',
  'Volkswagon', 'Volvo'
];

function changeValueAndGetFirst (autocomplete, autocompleteDiv, value){
  autocomplete.val(value);
  autocomplete.trigger('keyup');
  return autocompleteDiv.find('li').first();
}

suite('complete', function() {
  var autocomplete, fidelAutocomplete, autocompleteDiv, keyPress;

  suiteSetup(function(){
    autocomplete = $('#autocomplete').autocomplete({
      source : autocompleteSource
    });
    fidelAutocomplete = autocomplete.data('autocomplete');
    autocompleteDiv = autocomplete.next();
  });

  suite('init',function(){
    test('autocomplete should exists in jQuery', function(){
      assert.equal(typeof $().autocomplete, 'function');
    });
    test('autocomplete should create a div in which results will be presented', function(){
      assert.equal(autocompleteDiv.hasClass(fidelAutocomplete.listClass), true);
    });
    test('autocomplete should turn browser autocompletion off', function(){
      assert.equal(autocomplete.attr('autocomplete'), 'off');
    });
    test('autocomplete should store internal sources', function(){
      assert.equal(autocompleteSource.length, fidelAutocomplete.source.length);
    });
  });
  suite('suggestions', function(){
    test('autocomplete should offer suggestions on keypress', function(){
      autocomplete.val('a');
      autocomplete.trigger('keyup');
      assert.ok(autocompleteDiv.find('li').length > 0);
    });
    test('autocomplete shouldn\'t offer suggestions when value is not in source', function(){
      autocomplete.val('z');
      autocomplete.trigger('keyup');

      assert.equal(autocompleteDiv.find('li').length, 0);
    });
    test('suggestions should receive a special class on hover', function(){
      var firstLi = changeValueAndGetFirst(autocomplete,autocompleteDiv,'a');
      firstLi.trigger('mouseover');

      assert.ok(firstLi.hasClass(fidelAutocomplete.suggestionActiveClass));
    });
    test('autocomplete should keep track of which suggestion has been hovered', function(){
      var firstLi = changeValueAndGetFirst(autocomplete,autocompleteDiv,'a');
      firstLi.trigger('mouseover');

      assert.equal(firstLi.data('index'),fidelAutocomplete.selectedIndex);
    });
    test('suggestions should remove the special class on mouseout', function(){
      var firstLi = changeValueAndGetFirst(autocomplete,autocompleteDiv,'a');
      firstLi.trigger('mouseover');
      firstLi.trigger('mouseout');

      assert.ok(!firstLi.hasClass(fidelAutocomplete.suggestionActiveClass));
    });
    test('autocomplete should keep track that suggestion has been unselected', function(){
      var firstLi = changeValueAndGetFirst(autocomplete,autocompleteDiv,'a');
      firstLi.trigger('mouseover');
      firstLi.trigger('mouseout');

      assert.equal(-1,fidelAutocomplete.selectedIndex);
    });
  });
  suite('key accesibility', function(){
    setup(function(){
      autocomplete.val('a');
      autocomplete.trigger('keyup');
      keyPress = $.Event('keydown');
      keyPress.ctrlKey = false;
    });
    test('arrow down should select the next suggestion', function(){
      var currentSuggestion = fidelAutocomplete.selectedIndex;
      keyPress.keyCode = fidelAutocomplete.keyCode.DOWN;
      autocomplete.trigger(keyPress);
      assert.equal(fidelAutocomplete.selectedIndex, currentSuggestion+1);
    });
    test('arrow up should select the previous suggestion', function(){
      var currentSuggestion;
      keyPress.keyCode = fidelAutocomplete.keyCode.DOWN;
      autocomplete.trigger(keyPress);
      currentSuggestion = fidelAutocomplete.selectedIndex;
      autocomplete.trigger(keyPress);
      keyPress.keyCode = fidelAutocomplete.keyCode.UP;
      autocomplete.trigger(keyPress);

      assert.equal(fidelAutocomplete.selectedIndex, currentSuggestion);
    });
    test('enter should change the value to the current selected suggestion', function(){
      keyPress.keyCode = fidelAutocomplete.keyCode.DOWN;
      autocomplete.trigger(keyPress);
      var suggestionValue = fidelAutocomplete.suggestions[fidelAutocomplete.selectedIndex];
      keyPress.keyCode = fidelAutocomplete.keyCode.ENTER;
      autocomplete.trigger(keyPress);
      assert.equal(autocomplete.val(), suggestionValue);
    });
    test('escape should return the input to the default value', function(){
      autocomplete.trigger('keyup');
      var esc = $.Event('keydown'),
          originalValue = autocomplete.val();

      esc.keyCode = fidelAutocomplete.keyCode.ESC;
      keyPress.keyCode = fidelAutocomplete.keyCode.DOWN;

      autocomplete.trigger(keyPress);
      autocomplete.trigger(esc);

      assert.equal(autocomplete.val(), originalValue);
    });

  });
});
