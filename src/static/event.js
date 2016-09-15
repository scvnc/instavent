var $input = $( '.datepicker' ).pickadate({
  formatSubmit: 'yyyy/mm/dd',
  // min: [2015, 7, 14],
  container: '#container',
  // editable: true,
  closeOnSelect: false,
  closeOnClear: false,
})

var picker = $input.pickadate('picker')
// picker.set('select', '14 October, 2014')
// picker.open()

// $('button').on('click', function() {
//     picker.set('disable', true);
// });
