
suite('complete', function() {
  var autocomplete;

  setup(function(){
    autocomplete = $('#autocomplete').autocomplete({
      source : [
        'Acura', 'Audi', 'BMW', 'Cadillac',
        'Chrysler', 'Dodge', 'Ferrari', 'Ford',
        'GMC', 'Honda', 'Hyundai', 'Infiniti',
        'Jeep', 'Kia', 'Lexus', 'Mini',
        'Nissan', 'Porsche', 'Subaru', 'Toyota',
        'Volkswagon', 'Volvo'
      ]
    });
  });

  suite('init',function(){
    test('autocomplete should exists in jQuery', function(){
      assert.equal(typeof $().autocomplete, 'function');
    });
    test('autocomplete should create a div in which results will be presented', function(){
    });
    test('autocomplete should turn browser autocompletion off', function(){
      assert.equal(autocomplete.attr('autocomplete'), 'off');
    });
  });
});
