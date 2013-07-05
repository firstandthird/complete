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
  var autocomplete, fidelAutocomplete, autocompleteDiv;

  setup(function(){
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

  });
});
