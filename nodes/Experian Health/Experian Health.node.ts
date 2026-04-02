/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-experianhealth/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class ExperianHealth implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Experian Health',
    name: 'experianhealth',
    icon: 'file:experianhealth.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Experian Health API',
    defaults: {
      name: 'Experian Health',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'experianhealthApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'EligibilityVerification',
            value: 'eligibilityVerification',
          },
          {
            name: 'ClaimsManagement',
            value: 'claimsManagement',
          },
          {
            name: 'Patient Estimates',
            value: 'patientEstimates',
          },
          {
            name: 'EdiTransactions',
            value: 'ediTransactions',
          },
          {
            name: 'ProviderDirectory',
            value: 'providerDirectory',
          },
          {
            name: 'PayerConnectivity',
            value: 'payerConnectivity',
          }
        ],
        default: 'eligibilityVerification',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
		},
	},
	options: [
		{
			name: 'Verify Eligibility',
			value: 'verifyEligibility',
			description: 'Verify patient insurance eligibility and benefits',
			action: 'Verify patient insurance eligibility',
		},
		{
			name: 'Get Eligibility Request',
			value: 'getEligibilityRequest',
			description: 'Retrieve eligibility verification request details',
			action: 'Get eligibility verification request details',
		},
		{
			name: 'Get All Eligibility Requests',
			value: 'getAllEligibilityRequests',
			description: 'List all eligibility verification requests',
			action: 'List all eligibility verification requests',
		},
		{
			name: 'Batch Verify Eligibility',
			value: 'batchVerifyEligibility',
			description: 'Submit batch eligibility verification requests',
			action: 'Submit batch eligibility verification requests',
		},
	],
	default: 'verifyEligibility',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['claimsManagement'] } },
  options: [
    { name: 'Submit Claim', value: 'submitClaim', description: 'Submit healthcare claim for processing', action: 'Submit claim' },
    { name: 'Get Claim', value: 'getClaim', description: 'Retrieve specific claim details and status', action: 'Get claim' },
    { name: 'Get All Claims', value: 'getAllClaims', description: 'List claims with filtering options', action: 'Get all claims' },
    { name: 'Update Claim', value: 'updateClaim', description: 'Update existing claim information', action: 'Update claim' },
    { name: 'Update Claim Status', value: 'updateClaimStatus', description: 'Update claim status or add notes', action: 'Update claim status' }
  ],
  default: 'submitClaim'
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['patientEstimates'] } },
	options: [
		{
			name: 'Calculate Estimate',
			value: 'calculateEstimate',
			description: 'Generate patient cost estimate for services',
			action: 'Calculate a patient estimate',
		},
		{
			name: 'Get Estimate',
			value: 'getEstimate',
			description: 'Retrieve specific patient estimate details',
			action: 'Get a patient estimate',
		},
		{
			name: 'Get All Estimates',
			value: 'getAllEstimates',
			description: 'List patient estimates with filtering',
			action: 'Get all patient estimates',
		},
		{
			name: 'Update Estimate',
			value: 'updateEstimate',
			description: 'Update existing patient estimate',
			action: 'Update a patient estimate',
		},
		{
			name: 'Delete Estimate',
			value: 'deleteEstimate',
			description: 'Remove patient estimate',
			action: 'Delete a patient estimate',
		},
	],
	default: 'calculateEstimate',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['ediTransactions'] } },
	options: [
		{
			name: 'Submit EDI Transaction',
			value: 'submitEdiTransaction',
			description: 'Submit EDI X12 transaction for processing',
			action: 'Submit EDI transaction',
		},
		{
			name: 'Get EDI Transaction',
			value: 'getEdiTransaction',
			description: 'Retrieve EDI transaction details and status',
			action: 'Get EDI transaction',
		},
		{
			name: 'Get All EDI Transactions',
			value: 'getAllEdiTransactions',
			description: 'List EDI transactions with filtering',
			action: 'Get all EDI transactions',
		},
		{
			name: 'Validate EDI Transaction',
			value: 'validateEdiTransaction',
			description: 'Validate EDI X12 format and content',
			action: 'Validate EDI transaction',
		},
		{
			name: 'Get EDI Acknowledgment',
			value: 'getEdiAcknowledgment',
			description: 'Retrieve EDI transaction acknowledgment',
			action: 'Get EDI acknowledgment',
		},
	],
	default: 'submitEdiTransaction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['providerDirectory'] } },
  options: [
    { name: 'Get Provider', value: 'getProvider', description: 'Retrieve provider details by NPI', action: 'Get provider by NPI' },
    { name: 'Search Providers', value: 'searchProviders', description: 'Search providers by various criteria', action: 'Search providers' },
    { name: 'Create Provider', value: 'createProvider', description: 'Add new provider to directory', action: 'Create provider' },
    { name: 'Update Provider', value: 'updateProvider', description: 'Update existing provider information', action: 'Update provider' },
    { name: 'Get Provider Networks', value: 'getProviderNetworks', description: 'Get provider network participation', action: 'Get provider networks' },
  ],
  default: 'getProvider',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['payerConnectivity'] } },
  options: [
    { name: 'Get All Payers', value: 'getAllPayers', description: 'List available payer connections', action: 'Get all payers' },
    { name: 'Get Payer', value: 'getPayer', description: 'Retrieve specific payer details and capabilities', action: 'Get payer' },
    { name: 'Test Payer Connection', value: 'testPayerConnection', description: 'Test connectivity to specific payer', action: 'Test payer connection' },
    { name: 'Get Payer Status', value: 'getPayerStatus', description: 'Check payer system status and availability', action: 'Get payer status' },
    { name: 'Get Payer Transactions', value: 'getPayerTransactions', description: 'List transactions for specific payer', action: 'Get payer transactions' }
  ],
  default: 'getAllPayers',
},
{
	displayName: 'Subscriber ID',
	name: 'subscriberId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['verifyEligibility'],
		},
	},
	default: '',
	description: 'The patient insurance subscriber ID',
},
{
	displayName: 'Payer ID',
	name: 'payerId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['verifyEligibility'],
		},
	},
	default: '',
	description: 'The insurance payer identifier',
},
{
	displayName: 'Service Type Code',
	name: 'serviceTypeCode',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['verifyEligibility'],
		},
	},
	default: '',
	description: 'The healthcare service type code',
},
{
	displayName: 'Provider NPI',
	name: 'providerNPI',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['verifyEligibility'],
		},
	},
	default: '',
	description: 'The healthcare provider National Provider Identifier',
},
{
	displayName: 'Request ID',
	name: 'requestId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['getEligibilityRequest'],
		},
	},
	default: '',
	description: 'The eligibility verification request ID',
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['getAllEligibilityRequests'],
		},
	},
	default: '',
	description: 'Filter requests from this date',
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['getAllEligibilityRequests'],
		},
	},
	default: '',
	description: 'Filter requests until this date',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{
			name: 'Pending',
			value: 'pending',
		},
		{
			name: 'Completed',
			value: 'completed',
		},
		{
			name: 'Failed',
			value: 'failed',
		},
	],
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['getAllEligibilityRequests'],
		},
	},
	default: '',
	description: 'Filter requests by status',
},
{
	displayName: 'Page Size',
	name: 'pageSize',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['getAllEligibilityRequests'],
		},
	},
	default: 50,
	description: 'Number of records per page',
},
{
	displayName: 'Page Number',
	name: 'pageNumber',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['getAllEligibilityRequests'],
		},
	},
	default: 1,
	description: 'Page number to retrieve',
},
{
	displayName: 'Requests',
	name: 'requests',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['batchVerifyEligibility'],
		},
	},
	default: '[]',
	description: 'Array of eligibility verification requests in JSON format',
},
{
	displayName: 'Callback URL',
	name: 'callbackUrl',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['eligibilityVerification'],
			operation: ['batchVerifyEligibility'],
		},
	},
	default: '',
	description: 'URL to receive batch processing results',
},
{
  displayName: 'Claim Data',
  name: 'claimData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['submitClaim'] } },
  default: '{}',
  description: 'JSON object containing the claim information'
},
{
  displayName: 'Provider ID',
  name: 'providerId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['submitClaim'] } },
  default: '',
  description: 'Healthcare provider identifier'
},
{
  displayName: 'Payer ID',
  name: 'payerId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['submitClaim'] } },
  default: '',
  description: 'Insurance payer identifier'
},
{
  displayName: 'Patient ID',
  name: 'patientId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['submitClaim'] } },
  default: '',
  description: 'Patient identifier'
},
{
  displayName: 'Claim ID',
  name: 'claimId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['getClaim', 'updateClaim', 'updateClaimStatus'] } },
  default: '',
  description: 'Unique identifier for the claim'
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['getAllClaims'] } },
  options: [
    { name: 'Submitted', value: 'submitted' },
    { name: 'Processing', value: 'processing' },
    { name: 'Approved', value: 'approved' },
    { name: 'Denied', value: 'denied' },
    { name: 'Pending', value: 'pending' }
  ],
  default: '',
  description: 'Filter claims by status'
},
{
  displayName: 'Date Range',
  name: 'dateRange',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['getAllClaims'] } },
  default: '',
  description: 'Date range for filtering claims (e.g., 2024-01-01:2024-12-31)'
},
{
  displayName: 'Provider ID (Filter)',
  name: 'providerIdFilter',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['getAllClaims'] } },
  default: '',
  description: 'Filter claims by provider ID'
},
{
  displayName: 'Payer ID (Filter)',
  name: 'payerIdFilter',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['getAllClaims'] } },
  default: '',
  description: 'Filter claims by payer ID'
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['getAllClaims'] } },
  default: 50,
  description: 'Number of claims per page'
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['getAllClaims'] } },
  default: 1,
  description: 'Page number to retrieve'
},
{
  displayName: 'Claim Data',
  name: 'claimData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['updateClaim'] } },
  default: '{}',
  description: 'JSON object containing updated claim information'
},
{
  displayName: 'Status',
  name: 'statusUpdate',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['updateClaimStatus'] } },
  options: [
    { name: 'Submitted', value: 'submitted' },
    { name: 'Processing', value: 'processing' },
    { name: 'Approved', value: 'approved' },
    { name: 'Denied', value: 'denied' },
    { name: 'Pending', value: 'pending' }
  ],
  default: 'processing',
  description: 'New status for the claim'
},
{
  displayName: 'Notes',
  name: 'notes',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['claimsManagement'], operation: ['updateClaimStatus'] } },
  default: '',
  description: 'Additional notes for the status update'
},
{
	displayName: 'Patient ID',
	name: 'patientId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['patientEstimates'],
			operation: ['calculateEstimate'],
		},
	},
	default: '',
	description: 'The unique identifier for the patient',
},
{
	displayName: 'Service Code',
	name: 'serviceCode',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['patientEstimates'],
			operation: ['calculateEstimate'],
		},
	},
	default: '',
	description: 'The medical service code for the estimate',
},
{
	displayName: 'Provider ID',
	name: 'providerId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['patientEstimates'],
			operation: ['calculateEstimate'],
		},
	},
	default: '',
	description: 'The unique identifier for the healthcare provider',
},
{
	displayName: 'Facility ID',
	name: 'facilityId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['patientEstimates'],
			operation: ['calculateEstimate'],
		},
	},
	default: '',
	description: 'The unique identifier for the healthcare facility',
},
{
	displayName: 'Estimate ID',
	name: 'estimateId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['patientEstimates'],
			operation: ['getEstimate', 'updateEstimate', 'deleteEstimate'],
		},
	},
	default: '',
	description: 'The unique identifier for the patient estimate',
},
{
	displayName: 'Patient ID',
	name: 'patientId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['patientEstimates'],
			operation: ['getAllEstimates'],
		},
	},
	default: '',
	description: 'Filter by patient ID',
},
{
	displayName: 'Provider ID',
	name: 'providerId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['patientEstimates'],
			operation: ['getAllEstimates'],
		},
	},
	default: '',
	description: 'Filter by provider ID',
},
{
	displayName: 'Date Range',
	name: 'dateRange',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['patientEstimates'],
			operation: ['getAllEstimates'],
		},
	},
	default: '',
	description: 'Filter by date range (YYYY-MM-DD to YYYY-MM-DD)',
},
{
	displayName: 'Page Size',
	name: 'pageSize',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['patientEstimates'],
			operation: ['getAllEstimates'],
		},
	},
	default: 20,
	description: 'Number of records per page',
},
{
	displayName: 'Page Number',
	name: 'pageNumber',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['patientEstimates'],
			operation: ['getAllEstimates'],
		},
	},
	default: 1,
	description: 'Page number to retrieve',
},
{
	displayName: 'Estimate Data',
	name: 'estimateData',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['patientEstimates'],
			operation: ['updateEstimate'],
		},
	},
	default: '{}',
	description: 'The estimate data to update',
},
{
	displayName: 'Transaction Type',
	name: 'transactionType',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['ediTransactions'],
			operation: ['submitEdiTransaction', 'validateEdiTransaction'],
		},
	},
	options: [
		{ name: '837P - Professional Claims', value: '837P' },
		{ name: '837I - Institutional Claims', value: '837I' },
		{ name: '837D - Dental Claims', value: '837D' },
		{ name: '270 - Eligibility Inquiry', value: '270' },
		{ name: '271 - Eligibility Response', value: '271' },
		{ name: '276 - Claim Status Inquiry', value: '276' },
		{ name: '277 - Claim Status Response', value: '277' },
		{ name: '835 - ERA Remittance', value: '835' },
		{ name: '999 - Functional Acknowledgment', value: '999' },
	],
	default: '837P',
	description: 'Type of EDI X12 transaction',
},
{
	displayName: 'EDI Content',
	name: 'ediContent',
	type: 'string',
	typeOptions: {
		rows: 10,
	},
	required: true,
	displayOptions: {
		show: {
			resource: ['ediTransactions'],
			operation: ['submitEdiTransaction', 'validateEdiTransaction'],
		},
	},
	default: '',
	description: 'Raw EDI X12 transaction content',
},
{
	displayName: 'Trading Partner ID',
	name: 'tradingPartnerId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['ediTransactions'],
			operation: ['submitEdiTransaction'],
		},
	},
	default: '',
	description: 'ID of the trading partner for this transaction',
},
{
	displayName: 'Transaction ID',
	name: 'transactionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['ediTransactions'],
			operation: ['getEdiTransaction', 'getEdiAcknowledgment'],
		},
	},
	default: '',
	description: 'Unique identifier for the EDI transaction',
},
{
	displayName: 'Transaction Type Filter',
	name: 'transactionTypeFilter',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['ediTransactions'],
			operation: ['getAllEdiTransactions'],
		},
	},
	options: [
		{ name: 'All Types', value: '' },
		{ name: '837P - Professional Claims', value: '837P' },
		{ name: '837I - Institutional Claims', value: '837I' },
		{ name: '837D - Dental Claims', value: '837D' },
		{ name: '270 - Eligibility Inquiry', value: '270' },
		{ name: '271 - Eligibility Response', value: '271' },
		{ name: '276 - Claim Status Inquiry', value: '276' },
		{ name: '277 - Claim Status Response', value: '277' },
		{ name: '835 - ERA Remittance', value: '835' },
		{ name: '999 - Functional Acknowledgment', value: '999' },
	],
	default: '',
	description: 'Filter transactions by type',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['ediTransactions'],
			operation: ['getAllEdiTransactions'],
		},
	},
	options: [
		{ name: 'All Statuses', value: '' },
		{ name: 'Pending', value: 'pending' },
		{ name: 'Processing', value: 'processing' },
		{ name: 'Completed', value: 'completed' },
		{ name: 'Failed', value: 'failed' },
		{ name: 'Rejected', value: 'rejected' },
	],
	default: '',
	description: 'Filter transactions by status',
},
{
	displayName: 'Date Range',
	name: 'dateRange',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: false,
	},
	displayOptions: {
		show: {
			resource: ['ediTransactions'],
			operation: ['getAllEdiTransactions'],
		},
	},
	default: {},
	options: [
		{
			name: 'range',
			displayName: 'Date Range',
			values: [
				{
					displayName: 'Start Date',
					name: 'startDate',
					type: 'dateTime',
					default: '',
					description: 'Start date for filtering transactions',
				},
				{
					displayName: 'End Date',
					name: 'endDate',
					type: 'dateTime',
					default: '',
					description: 'End date for filtering transactions',
				},
			],
		},
	],
	description: 'Date range for filtering transactions',
},
{
	displayName: 'Page Size',
	name: 'pageSize',
	type: 'number',
	typeOptions: {
		minValue: 1,
		maxValue: 100,
	},
	displayOptions: {
		show: {
			resource: ['ediTransactions'],
			operation: ['getAllEdiTransactions'],
		},
	},
	default: 25,
	description: 'Number of transactions to return per page',
},
{
	displayName: 'Page Number',
	name: 'pageNumber',
	type: 'number',
	typeOptions: {
		minValue: 1,
	},
	displayOptions: {
		show: {
			resource: ['ediTransactions'],
			operation: ['getAllEdiTransactions'],
		},
	},
	default: 1,
	description: 'Page number to retrieve',
},
{
  displayName: 'NPI',
  name: 'npi',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['getProvider'] } },
  default: '',
  description: 'National Provider Identifier (NPI) number',
},
{
  displayName: 'Provider Name',
  name: 'name',
  type: 'string',
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['searchProviders'] } },
  default: '',
  description: 'Provider name to search for',
},
{
  displayName: 'Specialty',
  name: 'specialty',
  type: 'string',
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['searchProviders'] } },
  default: '',
  description: 'Provider specialty to filter by',
},
{
  displayName: 'Location',
  name: 'location',
  type: 'string',
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['searchProviders'] } },
  default: '',
  description: 'Location to search within',
},
{
  displayName: 'Network ID',
  name: 'networkId',
  type: 'string',
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['searchProviders'] } },
  default: '',
  description: 'Network identifier to filter by',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['searchProviders'] } },
  default: 50,
  description: 'Number of results per page',
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['searchProviders'] } },
  default: 1,
  description: 'Page number to retrieve',
},
{
  displayName: 'Provider Data',
  name: 'providerData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['createProvider', 'updateProvider'] } },
  default: '{}',
  description: 'Provider information in JSON format',
},
{
  displayName: 'NPI Number',
  name: 'npiNumber',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['createProvider'] } },
  default: '',
  description: 'National Provider Identifier number for new provider',
},
{
  displayName: 'Taxonomy Code',
  name: 'taxonomyCode',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['createProvider'] } },
  default: '',
  description: 'Healthcare Provider Taxonomy Code',
},
{
  displayName: 'NPI',
  name: 'npi',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['updateProvider'] } },
  default: '',
  description: 'National Provider Identifier (NPI) number to update',
},
{
  displayName: 'NPI',
  name: 'npi',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['providerDirectory'], operation: ['getProviderNetworks'] } },
  default: '',
  description: 'National Provider Identifier (NPI) number',
},
{
  displayName: 'State',
  name: 'state',
  type: 'string',
  displayOptions: { show: { resource: ['payerConnectivity'], operation: ['getAllPayers'] } },
  default: '',
  description: 'Filter payers by state',
},
{
  displayName: 'Plan Type',
  name: 'planType',
  type: 'string',
  displayOptions: { show: { resource: ['payerConnectivity'], operation: ['getAllPayers'] } },
  default: '',
  description: 'Filter payers by plan type',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: { show: { resource: ['payerConnectivity'], operation: ['getAllPayers'] } },
  default: 50,
  description: 'Number of payers per page',
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  displayOptions: { show: { resource: ['payerConnectivity'], operation: ['getAllPayers'] } },
  default: 1,
  description: 'Page number to retrieve',
},
{
  displayName: 'Payer ID',
  name: 'payerId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['payerConnectivity'], operation: ['getPayer', 'testPayerConnection', 'getPayerStatus', 'getPayerTransactions'] } },
  default: '',
  description: 'Unique identifier of the payer',
},
{
  displayName: 'Transaction Type',
  name: 'transactionType',
  type: 'options',
  displayOptions: { show: { resource: ['payerConnectivity'], operation: ['testPayerConnection', 'getPayerTransactions'] } },
  options: [
    { name: 'Eligibility', value: 'eligibility' },
    { name: 'Claims', value: 'claims' },
    { name: 'Prior Authorization', value: 'prior_auth' },
    { name: 'Claim Status', value: 'claim_status' }
  ],
  default: 'eligibility',
  description: 'Type of transaction to test or filter by',
},
{
  displayName: 'Date Range',
  name: 'dateRange',
  type: 'string',
  displayOptions: { show: { resource: ['payerConnectivity'], operation: ['getPayerTransactions'] } },
  default: '',
  description: 'Date range for transaction lookup (e.g., 2024-01-01,2024-01-31)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'eligibilityVerification':
        return [await executeEligibilityVerificationOperations.call(this, items)];
      case 'claimsManagement':
        return [await executeClaimsManagementOperations.call(this, items)];
      case 'patientEstimates':
        return [await executePatientEstimatesOperations.call(this, items)];
      case 'ediTransactions':
        return [await executeEdiTransactionsOperations.call(this, items)];
      case 'providerDirectory':
        return [await executeProviderDirectoryOperations.call(this, items)];
      case 'payerConnectivity':
        return [await executePayerConnectivityOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeEligibilityVerificationOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('experianhealthApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'verifyEligibility': {
					const subscriberId = this.getNodeParameter('subscriberId', i) as string;
					const payerId = this.getNodeParameter('payerId', i) as string;
					const serviceTypeCode = this.getNodeParameter('serviceTypeCode', i) as string;
					const providerNPI = this.getNodeParameter('providerNPI', i) as string;

					const body = {
						subscriberId,
						payerId,
						serviceTypeCode,
						providerNPI,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/eligibility/verify`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEligibilityRequest': {
					const requestId = this.getNodeParameter('requestId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/eligibility/requests/${requestId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllEligibilityRequests': {
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const pageSize = this.getNodeParameter('pageSize', i) as number;
					const pageNumber = this.getNodeParameter('pageNumber', i) as number;

					const queryParams = new URLSearchParams();
					if (startDate) queryParams.append('startDate', startDate);
					if (endDate) queryParams.append('endDate', endDate);
					if (status) queryParams.append('status', status);
					if (pageSize) queryParams.append('pageSize', pageSize.toString());
					if (pageNumber) queryParams.append('pageNumber', pageNumber.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/eligibility/requests?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'batchVerifyEligibility': {
					const requests = this.getNodeParameter('requests', i) as string;
					const callbackUrl = this.getNodeParameter('callbackUrl', i) as string;

					const body: any = {
						requests: JSON.parse(requests),
					};

					if (callbackUrl) {
						body.callbackUrl = callbackUrl;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/eligibility/batch`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: {
					item: i,
				},
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: {
						item: i,
					},
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeClaimsManagementOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('experianhealthApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'submitClaim': {
          const claimData = this.getNodeParameter('claimData', i) as object;
          const providerId = this.getNodeParameter('providerId', i) as string;
          const payerId = this.getNodeParameter('payerId', i) as string;
          const patientId = this.getNodeParameter('patientId', i) as string;

          const body = {
            ...claimData,
            providerId,
            payerId,
            patientId
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/claims/submit`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getClaim': {
          const claimId = this.getNodeParameter('claimId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/claims/${claimId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllClaims': {
          const status = this.getNodeParameter('status', i, '') as string;
          const dateRange = this.getNodeParameter('dateRange', i, '') as string;
          const providerIdFilter = this.getNodeParameter('providerIdFilter', i, '') as string;
          const payerIdFilter = this.getNodeParameter('payerIdFilter', i, '') as string;
          const pageSize = this.getNodeParameter('pageSize', i, 50) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i, 1) as number;

          const queryParams: any = {
            pageSize: pageSize.toString(),
            pageNumber: pageNumber.toString()
          };

          if (status) queryParams.status = status;
          if (dateRange) queryParams.dateRange = dateRange;
          if (providerIdFilter) queryParams.providerId = providerIdFilter;
          if (payerIdFilter) queryParams.payerId = payerIdFilter;

          const queryString = Object.keys(queryParams)
            .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
            .join('&');

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/claims?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateClaim': {
          const claimId = this.getNodeParameter('claimId', i) as string;
          const claimData = this.getNodeParameter('claimData', i) as object;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/claims/${claimId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: claimData,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateClaimStatus': {
          const claimId = this.getNodeParameter('claimId', i) as string;
          const statusUpdate = this.getNodeParameter('statusUpdate', i) as string;
          const notes = this.getNodeParameter('notes', i, '') as string;

          const body: any = { status: statusUpdate };
          if (notes) body.notes = notes;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/claims/${claimId}/status`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePatientEstimatesOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('experianhealthApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'calculateEstimate': {
					const patientId = this.getNodeParameter('patientId', i) as string;
					const serviceCode = this.getNodeParameter('serviceCode', i) as string;
					const providerId = this.getNodeParameter('providerId', i) as string;
					const facilityId = this.getNodeParameter('facilityId', i) as string;

					const body = {
						patientId,
						serviceCode,
						providerId,
						facilityId,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/estimates/calculate`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEstimate': {
					const estimateId = this.getNodeParameter('estimateId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/estimates/${estimateId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllEstimates': {
					const patientId = this.getNodeParameter('patientId', i) as string;
					const providerId = this.getNodeParameter('providerId', i) as string;
					const dateRange = this.getNodeParameter('dateRange', i) as string;
					const pageSize = this.getNodeParameter('pageSize', i) as number;
					const pageNumber = this.getNodeParameter('pageNumber', i) as number;

					const queryParams: any = {
						pageSize,
						pageNumber,
					};

					if (patientId) {
						queryParams.patientId = patientId;
					}
					if (providerId) {
						queryParams.providerId = providerId;
					}
					if (dateRange) {
						queryParams.dateRange = dateRange;
					}

					const queryString = Object.keys(queryParams)
						.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
						.join('&');

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/estimates?${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateEstimate': {
					const estimateId = this.getNodeParameter('estimateId', i) as string;
					const estimateData = this.getNodeParameter('estimateData', i) as string;

					let body: any;
					try {
						body = typeof estimateData === 'string' ? JSON.parse(estimateData) : estimateData;
					} catch (parseError: any) {
						throw new NodeOperationError(this.getNode(), 'Invalid JSON in estimate data');
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/estimates/${estimateId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteEstimate': {
					const estimateId = this.getNodeParameter('estimateId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/estimates/${estimateId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeEdiTransactionsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('experianhealthApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'submitEdiTransaction': {
					const transactionType = this.getNodeParameter('transactionType', i) as string;
					const ediContent = this.getNodeParameter('ediContent', i) as string;
					const tradingPartnerId = this.getNodeParameter('tradingPartnerId', i) as string;

					const body = {
						transactionType,
						ediContent,
						tradingPartnerId,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/edi/transactions`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEdiTransaction': {
					const transactionId = this.getNodeParameter('transactionId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/edi/transactions/${transactionId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllEdiTransactions': {
					const transactionTypeFilter = this.getNodeParameter('transactionTypeFilter', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const dateRange = this.getNodeParameter('dateRange', i) as any;
					const pageSize = this.getNodeParameter('pageSize', i) as number;
					const pageNumber = this.getNodeParameter('pageNumber', i) as number;

					const queryParams: any = {
						pageSize: pageSize.toString(),
						pageNumber: pageNumber.toString(),
					};

					if (transactionTypeFilter) {
						queryParams.transactionType = transactionTypeFilter;
					}

					if (status) {
						queryParams.status = status;
					}

					if (dateRange?.range?.startDate) {
						queryParams.startDate = dateRange.range.startDate;
					}

					if (dateRange?.range?.endDate) {
						queryParams.endDate = dateRange.range.endDate;
					}

					const queryString = new URLSearchParams(queryParams).toString();

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/edi/transactions?${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'validateEdiTransaction': {
					const transactionType = this.getNodeParameter('transactionType', i) as string;
					const ediContent = this.getNodeParameter('ediContent', i) as string;

					const body = {
						transactionType,
						ediContent,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/edi/validate`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEdiAcknowledgment': {
					const transactionId = this.getNodeParameter('transactionId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/edi/acknowledgments/${transactionId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeProviderDirectoryOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('experianhealthApi') as any;
  
  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getProvider': {
          const npi = this.getNodeParameter('npi', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/providers/${npi}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'searchProviders': {
          const name = this.getNodeParameter('name', i) as string;
          const specialty = this.getNodeParameter('specialty', i) as string;
          const location = this.getNodeParameter('location', i) as string;
          const networkId = this.getNodeParameter('networkId', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i) as number;
          
          const queryParams = new URLSearchParams();
          if (name) queryParams.append('name', name);
          if (specialty) queryParams.append('specialty', specialty);
          if (location) queryParams.append('location', location);
          if (networkId) queryParams.append('networkId', networkId);
          queryParams.append('pageSize', pageSize.toString());
          queryParams.append('pageNumber', pageNumber.toString());
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/providers?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createProvider': {
          const providerData = this.getNodeParameter('providerData', i) as object;
          const npiNumber = this.getNodeParameter('npiNumber', i) as string;
          const taxonomyCode = this.getNodeParameter('taxonomyCode', i) as string;
          
          const requestBody = {
            ...providerData,
            npiNumber,
            taxonomyCode,
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/providers`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'updateProvider': {
          const npi = this.getNodeParameter('npi', i) as string;
          const providerData = this.getNodeParameter('providerData', i) as object;
          
          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/providers/${npi}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: providerData,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getProviderNetworks': {
          const npi = this.getNodeParameter('npi', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/providers/${npi}/networks`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executePayerConnectivityOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('experianhealthApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllPayers': {
          const state = this.getNodeParameter('state', i) as string;
          const planType = this.getNodeParameter('planType', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i) as number;

          const queryParams: any = {};
          if (state) queryParams.state = state;
          if (planType) queryParams.planType = planType;
          if (pageSize) queryParams.pageSize = pageSize;
          if (pageNumber) queryParams.pageNumber = pageNumber;

          const qs = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/payers${qs ? '?' + qs : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getPayer': {
          const payerId = this.getNodeParameter('payerId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/payers/${payerId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'testPayerConnection': {
          const payerId = this.getNodeParameter('payerId', i) as string;
          const transactionType = this.getNodeParameter('transactionType', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/payers/${payerId}/test`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: {
              transactionType
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getPayerStatus': {
          const payerId = this.getNodeParameter('payerId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/payers/${payerId}/status`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getPayerTransactions': {
          const payerId = this.getNodeParameter('payerId', i) as string;
          const dateRange = this.getNodeParameter('dateRange', i) as string;
          const transactionType = this.getNodeParameter('transactionType', i) as string;

          const queryParams: any = {};
          if (dateRange) queryParams.dateRange = dateRange;
          if (transactionType) queryParams.transactionType = transactionType;

          const qs = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/payers/${payerId}/transactions${qs ? '?' + qs : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
