// dependencies
var aws = require('aws-sdk');
var _ = require('underscore');
var path = require('path');
var when = require('when');
var moment = require('moment');

exports.handler = function(event, context) {

  console.log('event');
  console.log(event);

  var count = 1;
  if (event.count) count = parseInt(event.count);

  var started_by = 'lambda-ecs-task';
  if (event.startedBy) started_by = event.startedBy;

  var region = 'us-east-1';
  if (event.region) region = event.region;

  var ecs = new aws.ECS({ region: region });

  var promise = when.promise(function(resolve, reject, notify) {

    var params = {
      taskDefinition: event.task, /* required */
      cluster: event.cluster,
      count: count,
      startedBy: started_by
    };

    ecs.runTask(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        console.log(data);
        resolve(data);
      }
    });

  });

  promise.done(function(data){
    console.log('Task has been scheduled');
    context.succeed('Task has been scheduled');
  }, function(error){
    console.log('Failed to start task', error);
    context.fail('Failed to start task' + error);
  });


};
