/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ExperianHealth } from '../nodes/Experian Health/Experian Health.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('ExperianHealth Node', () => {
  let node: ExperianHealth;

  beforeAll(() => {
    node = new ExperianHealth();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Experian Health');
      expect(node.description.name).toBe('experianhealth');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('EligibilityVerification Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.experianhealth.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('verifyEligibility operation', () => {
		it('should verify patient insurance eligibility successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('verifyEligibility')
				.mockReturnValueOnce('SUB123')
				.mockReturnValueOnce('PAYER456')
				.mockReturnValueOnce('30')
				.mockReturnValueOnce('1234567890');

			const mockResponse = {
				requestId: 'REQ123',
				eligibility: {
					status: 'active',
					coverageLevel: 'family',
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEligibilityVerificationOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.experianhealth.com/v1/eligibility/verify',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					subscriberId: 'SUB123',
					payerId: 'PAYER456',
					serviceTypeCode: '30',
					providerNPI: '1234567890',
				},
				json: true,
			});
		});

		it('should handle verification errors gracefully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('verifyEligibility');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			const result = await executeEligibilityVerificationOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getEligibilityRequest operation', () => {
		it('should retrieve eligibility request details successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEligibilityRequest')
				.mockReturnValueOnce('REQ123');

			const mockResponse = {
				requestId: 'REQ123',
				status: 'completed',
				eligibility: {
					status: 'active',
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEligibilityVerificationOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.experianhealth.com/v1/eligibility/requests/REQ123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('getAllEligibilityRequests operation', () => {
		it('should list all eligibility requests successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllEligibilityRequests')
				.mockReturnValueOnce('2023-01-01')
				.mockReturnValueOnce('2023-01-31')
				.mockReturnValueOnce('completed')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(1);

			const mockResponse = {
				requests: [
					{ requestId: 'REQ123', status: 'completed' },
					{ requestId: 'REQ124', status: 'completed' },
				],
				totalCount: 2,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEligibilityVerificationOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('batchVerifyEligibility operation', () => {
		it('should submit batch eligibility verification successfully', async () => {
			const requestsArray = JSON.stringify([
				{ subscriberId: 'SUB123', payerId: 'PAYER456' },
				{ subscriberId: 'SUB124', payerId: 'PAYER457' },
			]);

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('batchVerifyEligibility')
				.mockReturnValueOnce(requestsArray)
				.mockReturnValueOnce('https://callback.example.com/webhook');

			const mockResponse = {
				batchId: 'BATCH123',
				status: 'submitted',
				requestCount: 2,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEligibilityVerificationOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.experianhealth.com/v1/eligibility/batch',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					requests: JSON.parse(requestsArray),
					callbackUrl: 'https://callback.example.com/webhook',
				},
				json: true,
			});
		});
	});
});

describe('ClaimsManagement Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.experianhealth.com/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      }
    };
  });

  describe('submitClaim operation', () => {
    it('should submit a claim successfully', async () => {
      const mockClaim = { amount: 1000, serviceDate: '2024-01-01' };
      const mockResponse = { claimId: 'claim-123', status: 'submitted' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('submitClaim')
        .mockReturnValueOnce(mockClaim)
        .mockReturnValueOnce('provider-123')
        .mockReturnValueOnce('payer-456')
        .mockReturnValueOnce('patient-789');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeClaimsManagementOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.experianhealth.com/v1/claims/submit',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        body: {
          ...mockClaim,
          providerId: 'provider-123',
          payerId: 'payer-456',
          patientId: 'patient-789'
        },
        json: true
      });
    });

    it('should handle submit claim error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('submitClaim')
        .mockReturnValueOnce({})
        .mockReturnValueOnce('provider-123')
        .mockReturnValueOnce('payer-456')
        .mockReturnValueOnce('patient-789');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeClaimsManagementOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getClaim operation', () => {
    it('should retrieve a claim successfully', async () => {
      const mockResponse = { claimId: 'claim-123', status: 'approved' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getClaim')
        .mockReturnValueOnce('claim-123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeClaimsManagementOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.experianhealth.com/v1/claims/claim-123',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });
  });

  describe('getAllClaims operation', () => {
    it('should retrieve all claims with filters', async () => {
      const mockResponse = { claims: [], totalCount: 0 };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllClaims')
        .mockReturnValueOnce('approved')
        .mockReturnValueOnce('2024-01-01:2024-12-31')
        .mockReturnValueOnce('provider-123')
        .mockReturnValueOnce('payer-456')
        .mockReturnValueOnce(25)
        .mockReturnValueOnce(2);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeClaimsManagementOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.experianhealth.com/v1/claims?pageSize=25&pageNumber=2&status=approved&dateRange=2024-01-01%3A2024-12-31&providerId=provider-123&payerId=payer-456',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });
  });

  describe('updateClaim operation', () => {
    it('should update a claim successfully', async () => {
      const mockClaimData = { amount: 1500 };
      const mockResponse = { claimId: 'claim-123', status: 'updated' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateClaim')
        .mockReturnValueOnce('claim-123')
        .mockReturnValueOnce(mockClaimData);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeClaimsManagementOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.experianhealth.com/v1/claims/claim-123',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        body: mockClaimData,
        json: true
      });
    });
  });

  describe('updateClaimStatus operation', () => {
    it('should update claim status with notes', async () => {
      const mockResponse = { claimId: 'claim-123', status: 'approved' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateClaimStatus')
        .mockReturnValueOnce('claim-123')
        .mockReturnValueOnce('approved')
        .mockReturnValueOnce('Claim approved after review');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeClaimsManagementOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.experianhealth.com/v1/claims/claim-123/status',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        body: {
          status: 'approved',
          notes: 'Claim approved after review'
        },
        json: true
      });
    });
  });
});

describe('Patient Estimates Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.experianhealth.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('calculateEstimate', () => {
		it('should calculate patient estimate successfully', async () => {
			const mockResponse = { estimateId: 'est_123', totalCost: 1500.00 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('calculateEstimate')
				.mockReturnValueOnce('patient_123')
				.mockReturnValueOnce('service_456')
				.mockReturnValueOnce('provider_789')
				.mockReturnValueOnce('facility_101');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executePatientEstimatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.experianhealth.com/v1/estimates/calculate',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					patientId: 'patient_123',
					serviceCode: 'service_456',
					providerId: 'provider_789',
					facilityId: 'facility_101',
				}),
				json: true,
			});
		});

		it('should handle calculate estimate error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('calculateEstimate');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

			const result = await executePatientEstimatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getEstimate', () => {
		it('should retrieve estimate successfully', async () => {
			const mockResponse = { estimateId: 'est_123', status: 'active' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEstimate')
				.mockReturnValueOnce('est_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executePatientEstimatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle get estimate error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getEstimate');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('Not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

			const result = await executePatientEstimatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Not found' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getAllEstimates', () => {
		it('should retrieve all estimates successfully', async () => {
			const mockResponse = { estimates: [], totalCount: 0, page: 1 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllEstimates')
				.mockReturnValueOnce('patient_123')
				.mockReturnValueOnce('provider_789')
				.mockReturnValueOnce('2023-01-01 to 2023-12-31')
				.mockReturnValueOnce(20)
				.mockReturnValueOnce(1);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executePatientEstimatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateEstimate', () => {
		it('should update estimate successfully', async () => {
			const mockResponse = { estimateId: 'est_123', updated: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateEstimate')
				.mockReturnValueOnce('est_123')
				.mockReturnValueOnce('{"status": "updated"}');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executePatientEstimatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle update estimate error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('updateEstimate');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('Update failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

			const result = await executePatientEstimatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Update failed' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteEstimate', () => {
		it('should delete estimate successfully', async () => {
			const mockResponse = { success: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteEstimate')
				.mockReturnValueOnce('est_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executePatientEstimatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle delete estimate error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('deleteEstimate');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('Delete failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

			const result = await executePatientEstimatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Delete failed' }, pairedItem: { item: 0 } }]);
		});
	});
});

describe('EdiTransactions Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.experianhealth.com/v1'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('submitEdiTransaction', () => {
		it('should submit EDI transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('submitEdiTransaction')
				.mockReturnValueOnce('837P')
				.mockReturnValueOnce('ISA*00*...')
				.mockReturnValueOnce('PARTNER123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				transactionId: 'txn123',
				status: 'submitted',
			});

			const result = await executeEdiTransactionsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.experianhealth.com/v1/edi/transactions',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					transactionType: '837P',
					ediContent: 'ISA*00*...',
					tradingPartnerId: 'PARTNER123',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: { transactionId: 'txn123', status: 'submitted' },
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle submit EDI transaction error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('submitEdiTransaction')
				.mockReturnValueOnce('837P')
				.mockReturnValueOnce('ISA*00*...')
				.mockReturnValueOnce('PARTNER123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid EDI format'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeEdiTransactionsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{
				json: { error: 'Invalid EDI format' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getEdiTransaction', () => {
		it('should get EDI transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEdiTransaction')
				.mockReturnValueOnce('txn123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				transactionId: 'txn123',
				status: 'completed',
				transactionType: '837P',
			});

			const result = await executeEdiTransactionsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.experianhealth.com/v1/edi/transactions/txn123',
				headers: {
					'Authorization': 'Bearer test-token',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: {
					transactionId: 'txn123',
					status: 'completed',
					transactionType: '837P',
				},
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getAllEdiTransactions', () => {
		it('should get all EDI transactions with filters', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllEdiTransactions')
				.mockReturnValueOnce('837P')
				.mockReturnValueOnce('completed')
				.mockReturnValueOnce({ range: { startDate: '2023-01-01', endDate: '2023-12-31' } })
				.mockReturnValueOnce(25)
				.mockReturnValueOnce(1);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				transactions: [{ transactionId: 'txn123' }],
				totalCount: 1,
			});

			const result = await executeEdiTransactionsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: expect.stringContaining('https://api.experianhealth.com/v1/edi/transactions?'),
				headers: {
					'Authorization': 'Bearer test-token',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: {
					transactions: [{ transactionId: 'txn123' }],
					totalCount: 1,
				},
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('validateEdiTransaction', () => {
		it('should validate EDI transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('validateEdiTransaction')
				.mockReturnValueOnce('837P')
				.mockReturnValueOnce('ISA*00*...');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				isValid: true,
				errors: [],
			});

			const result = await executeEdiTransactionsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.experianhealth.com/v1/edi/validate',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					transactionType: '837P',
					ediContent: 'ISA*00*...',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: { isValid: true, errors: [] },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getEdiAcknowledgment', () => {
		it('should get EDI acknowledgment successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEdiAcknowledgment')
				.mockReturnValueOnce('txn123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				acknowledgmentId: 'ack123',
				status: 'accepted',
			});

			const result = await executeEdiTransactionsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.experianhealth.com/v1/edi/acknowledgments/txn123',
				headers: {
					'Authorization': 'Bearer test-token',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: {
					acknowledgmentId: 'ack123',
					status: 'accepted',
				},
				pairedItem: { item: 0 },
			}]);
		});
	});
});

describe('ProviderDirectory Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-access-token',
        baseUrl: 'https://api.experianhealth.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getProvider operation', () => {
    it('should get provider by NPI successfully', async () => {
      const mockResponse = { 
        npi: '1234567890', 
        name: 'Dr. John Smith',
        specialty: 'Internal Medicine' 
      };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProvider')
        .mockReturnValueOnce('1234567890');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

      const result = await executeProviderDirectoryOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.experianhealth.com/v1/providers/1234567890',
        headers: {
          'Authorization': 'Bearer test-access-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getProvider error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProvider')
        .mockReturnValueOnce('invalid-npi');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('Provider not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

      const result = await executeProviderDirectoryOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: { error: 'Provider not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('searchProviders operation', () => {
    it('should search providers successfully', async () => {
      const mockResponse = { 
        providers: [{ npi: '1234567890', name: 'Dr. John Smith' }],
        totalCount: 1 
      };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchProviders')
        .mockReturnValueOnce('John Smith')
        .mockReturnValueOnce('Internal Medicine')
        .mockReturnValueOnce('New York')
        .mockReturnValueOnce('NET001')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(1);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

      const result = await executeProviderDirectoryOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('createProvider operation', () => {
    it('should create provider successfully', async () => {
      const mockResponse = { npi: '1234567890', status: 'created' };
      const providerData = { name: 'Dr. Jane Doe', address: '123 Main St' };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createProvider')
        .mockReturnValueOnce(providerData)
        .mockReturnValueOnce('1234567890')
        .mockReturnValueOnce('207Q00000X');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

      const result = await executeProviderDirectoryOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('updateProvider operation', () => {
    it('should update provider successfully', async () => {
      const mockResponse = { npi: '1234567890', status: 'updated' };
      const providerData = { name: 'Dr. Jane Doe Updated' };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateProvider')
        .mockReturnValueOnce('1234567890')
        .mockReturnValueOnce(providerData);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

      const result = await executeProviderDirectoryOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getProviderNetworks operation', () => {
    it('should get provider networks successfully', async () => {
      const mockResponse = { 
        npi: '1234567890',
        networks: [{ networkId: 'NET001', name: 'Health Plan A' }]
      };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProviderNetworks')
        .mockReturnValueOnce('1234567890');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

      const result = await executeProviderDirectoryOperations.call(
        mockExecuteFunctions, 
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('PayerConnectivity Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token', 
        baseUrl: 'https://api.experianhealth.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get all payers successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllPayers')
      .mockReturnValueOnce('CA')
      .mockReturnValueOnce('HMO')
      .mockReturnValueOnce(25)
      .mockReturnValueOnce(1);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ payers: [], total: 0 });

    const result = await executePayerConnectivityOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({
      method: 'GET',
      url: 'https://api.experianhealth.com/v1/payers?state=CA&planType=HMO&pageSize=25&pageNumber=1'
    }));
  });

  it('should get specific payer successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPayer')
      .mockReturnValueOnce('PAYER123');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'PAYER123', name: 'Test Payer' });

    const result = await executePayerConnectivityOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({
      method: 'GET',
      url: 'https://api.experianhealth.com/v1/payers/PAYER123'
    }));
  });

  it('should test payer connection successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('testPayerConnection')
      .mockReturnValueOnce('PAYER123')
      .mockReturnValueOnce('eligibility');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: 'success', responseTime: 150 });

    const result = await executePayerConnectivityOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({
      method: 'POST',
      url: 'https://api.experianhealth.com/v1/payers/PAYER123/test'
    }));
  });

  it('should get payer status successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPayerStatus')
      .mockReturnValueOnce('PAYER123');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: 'online', lastUpdated: '2024-01-15T10:00:00Z' });

    const result = await executePayerConnectivityOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({
      method: 'GET',
      url: 'https://api.experianhealth.com/v1/payers/PAYER123/status'
    }));
  });

  it('should get payer transactions successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPayerTransactions')
      .mockReturnValueOnce('PAYER123')
      .mockReturnValueOnce('2024-01-01,2024-01-31')
      .mockReturnValueOnce('claims');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ transactions: [], total: 0 });

    const result = await executePayerConnectivityOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({
      method: 'GET',
      url: 'https://api.experianhealth.com/v1/payers/PAYER123/transactions?dateRange=2024-01-01%2C2024-01-31&transactionType=claims'
    }));
  });

  it('should handle errors when continue on fail is enabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllPayers');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executePayerConnectivityOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continue on fail is disabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllPayers');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executePayerConnectivityOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });
});
});
