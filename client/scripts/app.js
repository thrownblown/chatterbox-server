/* global $, _ */

var app = {};

//==Initialize Function========================================================
app.init = function(){
  //==Storage
  app.friends = {};
  app.rooms = {'all':[]}; // room: [ message, message...], properties: unreadCount
  app.tabs = {'all': true};
  app.myMessages = []; // Array of object messages

  app.lastGet;
  app.currentRoom = 'all';

  //==Cache jQuery Selectors
  app.$messageInput = $('.submission');
  app.$rooms = $('.rooms');
  app.$chat = $('.chat');
  app.$chatTabs = $('.nav-tabs');

  //==Start fetch
  app.fetch();

  $('.home').on('click', function(){
    app.changeRoom('all');
  });
};

//==Send Function==============================================================
app.send = function(message){

  if (message === undefined) {
    message = {
      username: window.location.search.match(/username=(.+)/)[1],
      text: app.$messageInput.val() || 'no text',
      roomname: app.currentRoom || 'default'
    };

    app.$messageInput.val('');
  }

  app.myMessages.push(message);

  $.ajax({
    // always use this url
    url: 'http://127.0.0.1:3000/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function () {
      console.log('chatterbox: Message sent');
    },
    error: function () {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

//==Fetch Function=============================================================
app.fetch = function(){
  var data = {
    order: '-createdAt'
  };

  // if (app.lastGet) {
  //   data.where = {createdAt:{$gte:{__type:'Date',iso:app.lastGet}}};
  // }

  $.ajax({
    url: 'http://127.0.0.1:3000/1/classes/chatterbox/',
    type: 'GET',
    data: data,
    dataType: 'json',
    success: function (data) {
      _.each(data.results, function(message) {
        if ((message.username !== undefined &&
             message.text !== undefined &&
             message.roomname !== undefined) &&
             (app.lastGet === undefined ||
             new Date(message.createdAt) > new Date(app.lastGet))) {

          if (!/[^\w]/.test(message) || message.roomname === '') {
            return;
          }

          message.roomname = message.roomname.replace(/[^\w]|\s/g, '');

          if (message.roomname === app.currentRoom || app.currentRoom === undefined) {
            app.addMessage(message);
          }

          if (!app.rooms.hasOwnProperty(message.roomname)) {
            app.addRoom(message.roomname);
          }

          if (message.roomname !== app.currentRoom) {
            app.rooms[message.roomname].unreadCount += 1;
          }
          app.rooms['all'].push(message);
          app.rooms[message.roomname].push(message);
        }
      });

      app.lastGet = new Date(Date.parse(data.results[0].createdAt));

      // Display unreadCount
      _.each(app.rooms, function(room, roomName) {
        $('#' + roomName + ' span').html(room.unreadCount);
      });

      setTimeout(app.fetch, 1000);
    },
    error: function () {
      console.error('chatterbox: Failed to send message');
    }
  });
};

//==Add Message Function=======================================================
app.addMessage = function(message) {
  var $message = $('<div></div>')
    .addClass('message')
    .text(message.username + ': ' + message.text);

  if (app.friends.hasOwnProperty(message.username)) {
    $message.addClass('friend');
  }

  app.$chat.prepend($message);

  $message.click(function() {
    app.addFriend(message.username);
  });
};

//==Clear Messages Function====================================================
app.clearMessages = function() {
  app.$chat.html('');
};

//==Room Functions=============================================================
//==Add Room
app.addRoom = function(roomName) {
  app.rooms[roomName] = [];
  app.rooms[roomName].unreadCount = 0;

  var $newRoom = $('<div></div>')
    .addClass('room')
    .attr('id', roomName)
    .append(roomName + ' ')
    .append('<span></span>');

  app.$rooms.append($newRoom);

  //Adds click event to new link
  $newRoom.click(function() {
    app.changeRoom(roomName);
  });
};

//==Change Room================================================================
app.changeRoom = function(roomName) {
  app.clearMessages();

  if(!app.tabs.hasOwnProperty(roomName)){
    app.addTab(roomName);
  } else {
    app.activateTab(roomName);
  }

  app.currentRoom = roomName;
  app.rooms[roomName].unreadCount = 0;
  $('#' + roomName + ' span').html('0');

  _.each(app.rooms[roomName], function(message) {
    app.addMessage(message);
  });
};


//==Add Tab====================================================================
app.addTab = function(roomName) {
  //==Append tab (if nonexistant)
  var $newTab = $('<li></li>')
    .attr('id', roomName)
    .append('<a href="#">' + roomName + '</a>');

  app.$chatTabs.append($newTab);
  app.tabs[roomName] = true;

  app.activateTab(roomName);

  //on click change room
  $newTab.on('click', function(){
    app.changeRoom(roomName);
  });
};

//==Activate Tab===============================================================
app.activateTab = function(roomName) {
  //==Inactivate old tab
  $('.nav-tabs .active').removeClass('active');

  //==Activate new tab
  $('#'+roomName).addClass('active');
};
//==Remove Tab=================================================================
app.removeTab = function() {
  //==Remove tab
  //==Activate default tab
};
//=Add Friend==================================================================
app.addFriend = function(friend){
  app.friends[friend] = true;
};

//==Initialize Page on Ready===================================================
$(document).ready(function() {
  app.init();
});
