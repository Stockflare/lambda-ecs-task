# Lambda ECS Task

A Lambda function to run a task on an ECS cluster. The function will be invoked by an AWS Cloudwatch Event with the following payload format

```
{
  "cluster": "ecs-ECSCluster-1CGZ6A9RQ9F37",
  "taskDefinition": "arn:aws:ecs:us-east-1:405091209094:task-definition/xxxxx-service-ServiceDefinition-1L1QC7DK1TXXX:1",
  "count": 1,
  "startedBy": "Test",
  "region": 'us-east-1'
}
```

`count` defaults to 1
`startedBy` is a string that will be shown in the ECS Console and defaults to 'lambda-ecs-task'
`region` will default to 'us-east-1'
