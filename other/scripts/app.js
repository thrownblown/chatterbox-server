// YOUR CODE HERE:

var App = function(yo){
  this.yo = yo;

};

App.prototype.init = function(){
  return;
};
App.prototype.send = function(){
  console.log('hey send')

  $.ajax({
    url:'http://127.0.0.1:3000/classes/messages/',
    type: 'POST',
    data: 'hello in there',
    dataType: 'text',

  });
  return;
};
App.prototype.fetch = function(){
  console.log('hey fetch')
  $.ajax({
    url:'http://127.0.0.1:3000/classes/messages/',
    type: 'GET'

  });
};
var app = new App();
