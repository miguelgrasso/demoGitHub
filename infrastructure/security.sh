#!/bin/bash
aws iam create-role --role-name rol-task-$AWS_NAME_CONTAINER --assume-role-policy-document '{"Version": "2012-10-17","Statement": [{"Sid": "","Effect": "Allow","Principal": {"Service": "ecs-tasks.amazonaws.com"},"Action": "sts:AssumeRole"}]}'

aws iam attach-role-policy --role-name rol-task-$AWS_NAME_CONTAINER --policy-arn arn:aws:iam::aws:policy/AdministratorAccess