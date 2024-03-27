SECURITY_GROUP_ID=$(aws ec2 describe-security-groups \
    --output text \
    --query 'SecurityGroups[?GroupName==`"'"$AWS_SECURITY_GROUP"'"`].GroupId | [0]')

if [ $SECURITY_GROUP_ID = "None" ]
then 
    SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name $AWS_SECURITY_GROUP --description $AWS_SECURITY_GROUP --vpc-id $AWS_VPC_ID --output text)
    aws ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port $AWS_CONTAINER_PORT --cidr $AWS_SECURITY_GROUP_CIDR
    echo "creacion"
fi 

TARGET_GROUP_ARN=$(aws elbv2 create-target-group --name $AWS_TARGET_GROUP --protocol TCP --port 80 --target-type ip --vpc-id $AWS_VPC_ID --health-check-protocol TCP --healthy-threshold-count 2 --unhealthy-threshold-count 2 --health-check-interval-seconds 10 --health-check-timeout-seconds 10 \
    --output text \
    --query 'TargetGroups[0].TargetGroupArn')

aws elbv2 create-listener --load-balancer-arn $AWS_NLB_ARN --protocol TCP --port $AWS_PORT_TARGET_NLB --default-actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN --output text --query 'Listeners[0].ListenerArn'

LOG_GROUP_ARN=$(aws logs describe-log-groups --log-group-name-prefix /ecs/$AWS_TASK_DEFINITION --output text --query logGroups[0].arn)
if [ $LOG_GROUP_ARN = "None" ]
then 
    aws logs create-log-group --log-group-name /ecs/$AWS_TASK_DEFINITION
fi

#Variables de entorno
TASKDEFINITION_ARN=$(aws ecs register-task-definition --family $AWS_TASK_DEFINITION --network-mode awsvpc --task-role-arn $AWS_TASK_ROLE_ARN --execution-role-arn $AWS_EXECUTION_ROLE_ARN --cpu $AWS_CPU --memory $AWS_MEMORY --tags '[{"key": "t.programa","value": "'"$AWS_TAG_VALUE01"'"},{"key": "t.dominio","value": "'"$AWS_TAG_VALUE02"'"},{"key": "t.pod","value": "'"$AWS_TAG_VALUE03"'"},{"key": "t.aplicacion","value": "'"$AWS_TAG_VALUE04"'"},{"key": "t.ambiente","value": "'"$AWS_TAG_VALUE05"'"}]' --requires-compatibilities "$AWS_REQUIRES_COMPATIBILITIES" --container-definitions '[{"name":"'"$AWS_NAME_CONTAINER"'","image":"'"$AWS_IMAGE"'","portMappings":[{"containerPort": '"$AWS_CONTAINER_PORT"',"hostPort": '"$AWS_HOST_PORT"',"protocol": "tcp"}],
"environment":[
    {"name":"DB_HOST","value":"'"$ENV_DB_HOST"'"},
    {"name":"DB_SCHEMA","value":"'"$ENV_DB_SCHEMA"'"},
    {"name":"DB_USER","value":"'"$ENV_DB_USER"'"},
    {"name":"DB_PASSWORD","value":"'"$ENV_DB_PASSWORD"'"},
	{"name":"JWT_SECRET","value":"'"$ENV_JWT_SECRET"'"},
    {"name":"PORT","value":"'"$ENV_PORT"'"}
],"logConfiguration": {"logDriver": "awslogs","options":{"awslogs-group":"/ecs/'"$AWS_TASK_DEFINITION"'","awslogs-region": "'"$AWS_ZONA"'","awslogs-stream-prefix": "ecs"}}}]' --output text --query taskDefinition.taskDefinitionArn)

SERVICES_ARN=$(aws ecs describe-services --cluster $AWS_CLUSTER --services $AWS_SERVICE_NAME --output text --query 'services[0].serviceArn')
STATUS_SERVICES=$(aws ecs describe-services --cluster $AWS_CLUSTER --services $AWS_SERVICE_NAME --output text --query 'services[0].status')

if [ $SERVICES_ARN = "None" ] | [ $STATUS_SERVICES = "INACTIVE" ]
then 
    echo "creacion sevicio"
    aws ecs create-service --cluster $AWS_CLUSTER --service-name $AWS_SERVICE_NAME --launch-type FARGATE --task-definition $TASKDEFINITION_ARN --desired-count $AWS_NUMBER_TASK --deployment-configuration '{"maximumPercent":200,"minimumHealthyPercent":100}' --network-configuration '{"awsvpcConfiguration":{"subnets":['"$AWS_SUBNET_PRIVATE"'],"securityGroups":["'"$SECURITY_GROUP_ID"'"],"assignPublicIp":"DISABLED"}}' --load-balancers '[{"targetGroupArn":"'"$TARGET_GROUP_ARN"'","containerName":"'"$AWS_NAME_CONTAINER"'","containerPort":'"$AWS_CONTAINER_PORT"'}]' --tags '[{"key": "t.programa","value": "'"$AWS_TAG_VALUE01"'"},{"key": "t.dominio","value": "'"$AWS_TAG_VALUE02"'"},{"key": "t.pod","value": "'"$AWS_TAG_VALUE03"'"},{"key": "t.aplicacion","value": "'"$AWS_TAG_VALUE04"'"},{"key": "t.ambiente","value": "'"$AWS_TAG_VALUE05"'"}]' --propagate-tags SERVICE
else 
    aws ecs update-service --service $AWS_SERVICE_NAME --cluster $AWS_CLUSTER --task-definition $TASKDEFINITION_ARN
fi
