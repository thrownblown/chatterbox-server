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
    url:'http://138.91.240.56:3000/classes/messages',
    type: 'POST',
    data: JSON.stringify('hello in there'),
    dataType: 'application/json',

  });
  return;
};
App.prototype.fetch = function(){
  console.log('hey fetch')
  $.ajax({
    url:'http://138.91.240.56:3000/classes/messages',
    type: 'GET'

  });
};
var app = new App();
