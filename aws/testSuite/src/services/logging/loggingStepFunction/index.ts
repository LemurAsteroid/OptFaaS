export default {
    stepFunctions: {
        stateMachines: {
            myStateMachine: {
                name: 'MyStateMachine',
                definition: {
                    Comment: 'Trigger Lambda with a 10-minute delay',
                    StartAt: 'Wait10Minutes',
                    States: {
                        Wait10Minutes: {
                            Type: 'Wait',
                            //   Seconds: 600, // 10 minutes
                            Seconds: 60,
                            Next: 'InvokeSecondLambda',
                        },
                        InvokeSecondLambda: {
                            Type: 'Task',
                            Resource: {
                                'Fn::GetAtt': ['cwLogger', 'Arn'],
                            },
                            End: true,
                        },
                    },
                },
            },
        },
    },
};