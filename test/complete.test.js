var autocompleteSource = [
  'Acura', 'Audi', 'BMW', 'Cadillac',
  'Chrysler', 'Dodge', 'Ferrari', 'Ford',
  'GMC', 'Honda', 'Hyundai', 'Infiniti',
  'Jeep', 'Kia', 'Lexus', 'Mini',
  'Nissan', 'Porsche', 'Subaru', 'Toyota',
  'Volkswagon', 'Volvo'
];


suite('complete', function() {
  var autocomplete, fidelAutocomplete;

  setup(function(){
    autocomplete = $('#autocomplete').autocomplete({
      source : autocompleteSource
    });
    fidelAutocomplete = autocomplete.data('autocomplete');
  });

  suite('init',function(){
    test('autocomplete should exists in jQuery', function(){
      assert.equal(typeof $().autocomplete, 'function');
    });
    test('autocomplete should create a div in which results will be presented', function(){
      var div = autocomplete.next();
      assert.equal(div.hasClass(fidelAutocomplete.listClass), true);
    });
    test('autocomplete should turn browser autocompletion off', function(){
      assert.equal(autocomplete.attr('autocomplete'), 'off');
    });
    test('autocomplete should store internal sources', function(){
      assert.equal(autocompleteSource.length, fidelAutocomplete.source.length);
    });
  });
});
