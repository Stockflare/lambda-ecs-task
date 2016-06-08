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

  var env_vars = {};
  if (event.environment) env_vars = event.environment;

  var promise = when.promise(function(resolve, reject, notify) {

    var task_params = {
      taskDefinition: event.task, /* required */
      cluster: event.cluster,
      count: count,
      startedBy: started_by
    };

    // Get the container definition details
    when.promise(function(resolve, reject, notify) {
      if (_.keys(env_vars).length > 0) {
        var def_params = {
          taskDefinition: event.task
        };
        ecs.describeTaskDefinition(def_params, function(err, data) {
          if (err) {
            reject(err);
          }
          else {
            var container_overrides = _.map(data.taskDefinition.containerDefinitions, function(container){
              return {
                name: container.name,
                environment: _.map(_.keys(env_vars), function(key){
                  return {
                    name: key,
                    value: env_vars[key]
                  };
                })
              };
            });
            // Set up the container override parameters
            task_params.overrides = {};
            task_params.overrides.containerOverrides = container_overrides;
            resolve();
          }
        });
      } else {
        resolve();
      }
    }).done(function(){
      console.log('task_params');
      console.log(JSON.stringify(task_params));
      // Start the ECS Task
      ecs.runTask(task_params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          console.log(data);
          resolve(data);
        }
      });
    }, function(err){
      reject(err);
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
