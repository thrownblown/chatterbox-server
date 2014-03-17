/* global $, app */

//==Enable use of enter key====================================================
$(document).keydown(function (e) {
  var messageField = $('.submission');
  var newRoomField = $('.newRoom');

  if (e.keyCode === 13) {
    if (messageField.is(':focus') && messageField.val() !== '') {
      app.send();
    }
    if (newRoomField.is(':focus') && newRoomField.val() !== '') {
      app.addRoom(newRoomField.val());
      app.changeRoom(newRoomField.val());
    }
  }
});
