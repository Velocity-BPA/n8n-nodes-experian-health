import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ExperianHealthApi implements ICredentialType {
	name = 'experianHealthApi';
	displayName = 'Experian Health API';
	documentationUrl = 'https://docs.experianhealth.com';
	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			required: true,
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: 'https://api.experianhealth.com/v1',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
			required: true,
			default: 'sandbox',
		},
	];
}