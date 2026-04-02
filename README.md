# n8n-nodes-experian-health

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Experian Health's healthcare revenue cycle management platform. This node provides access to 6 core resources including eligibility verification, claims management, patient estimates, EDI transactions, provider directory services, and payer connectivity solutions for healthcare organizations.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Healthcare](https://img.shields.io/badge/Healthcare-Revenue%20Cycle-green)
![EDI](https://img.shields.io/badge/EDI-Transactions-orange)
![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-red)

## Features

- **Real-time Eligibility Verification** - Verify patient insurance coverage and benefits instantly before service delivery
- **Comprehensive Claims Management** - Submit, track, and manage healthcare claims with automated status monitoring
- **Patient Financial Estimates** - Generate accurate cost estimates for patients prior to treatment or procedures
- **EDI Transaction Processing** - Handle X12 EDI transactions including 270/271, 276/277, and 837 claim formats
- **Provider Directory Integration** - Access and manage healthcare provider network directories and credentialing data
- **Payer Connectivity Solutions** - Establish secure connections with insurance payers for streamlined data exchange
- **Revenue Cycle Optimization** - Automate key revenue cycle workflows to reduce denials and improve cash flow
- **HIPAA Compliant Operations** - Ensure all healthcare data exchanges meet strict privacy and security requirements

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-experian-health`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-experian-health
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-experian-health.git
cd n8n-nodes-experian-health
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-experian-health
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Experian Health API authentication key | Yes |
| Environment | Production or Sandbox environment | Yes |
| Client ID | Your assigned client identifier | Yes |

## Resources & Operations

### 1. Eligibility Verification

| Operation | Description |
|-----------|-------------|
| Check Eligibility | Verify patient insurance eligibility and benefits |
| Get Coverage Details | Retrieve detailed coverage information for a patient |
| Verify Benefits | Check specific benefit coverage and limitations |
| Real-time Verification | Perform instant eligibility verification |

### 2. Claims Management

| Operation | Description |
|-----------|-------------|
| Submit Claim | Submit new healthcare claims for processing |
| Check Status | Monitor claim processing status and updates |
| Get Claim Details | Retrieve comprehensive claim information |
| Update Claim | Modify existing claim data |
| Resubmit Claim | Reprocess previously denied or rejected claims |
| Get Remittance | Retrieve electronic remittance advice (ERA) |

### 3. Patient Estimates

| Operation | Description |
|-----------|-------------|
| Generate Estimate | Create patient cost estimates for procedures |
| Get Estimate Details | Retrieve detailed estimate breakdowns |
| Update Estimate | Modify existing patient estimates |
| Compare Costs | Compare costs across different providers |
| Verify Insurance Impact | Calculate patient responsibility after insurance |

### 4. EDI Transactions

| Operation | Description |
|-----------|-------------|
| Send EDI 270 | Submit eligibility inquiry transactions |
| Receive EDI 271 | Process eligibility response transactions |
| Send EDI 276 | Submit claim status inquiry transactions |
| Receive EDI 277 | Process claim status response transactions |
| Send EDI 837 | Submit healthcare claim transactions |
| Validate Transaction | Verify EDI transaction format and content |

### 5. Provider Directory

| Operation | Description |
|-----------|-------------|
| Search Providers | Find healthcare providers by criteria |
| Get Provider Details | Retrieve comprehensive provider information |
| Verify Credentials | Check provider credentialing status |
| Update Provider Info | Modify provider directory data |
| Check Network Status | Verify provider network participation |

### 6. Payer Connectivity

| Operation | Description |
|-----------|-------------|
| Establish Connection | Create secure payer connections |
| Test Connectivity | Verify payer system availability |
| Get Payer List | Retrieve supported payer organizations |
| Monitor Status | Check payer connection health |
| Configure Settings | Manage payer-specific connection parameters |

## Usage Examples

```javascript
// Check patient eligibility before appointment
{
  "patientId": "PAT123456",
  "memberId": "ABC123456789",
  "payerId": "AETNA",
  "serviceDate": "2024-01-15",
  "providerNPI": "1234567890"
}
```

```javascript
// Submit a professional claim
{
  "claimId": "CLM20240115001",
  "patientId": "PAT123456",
  "providerId": "PROV001",
  "serviceLines": [
    {
      "procedureCode": "99213",
      "diagnosisCode": "Z00.00",
      "chargeAmount": 150.00,
      "serviceDate": "2024-01-15"
    }
  ]
}
```

```javascript
// Generate patient estimate for procedure
{
  "patientId": "PAT123456",
  "procedureCode": "29881",
  "facilityId": "FAC001",
  "estimateType": "comprehensive",
  "includeInsurance": true
}
```

```javascript
// Send EDI 270 eligibility inquiry
{
  "transactionType": "270",
  "memberId": "XYZ987654321",
  "payerId": "BCBS",
  "providerNPI": "9876543210",
  "serviceTypeCodes": ["30", "35", "86"]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication credentials are incorrect | Verify API key and client ID in credentials |
| Patient Not Found | Specified patient ID does not exist | Check patient identifier and ensure proper registration |
| Payer Unavailable | Insurance payer system is temporarily down | Retry request or check payer connectivity status |
| Invalid EDI Format | EDI transaction contains formatting errors | Validate transaction structure against X12 standards |
| Eligibility Expired | Patient insurance eligibility has expired | Verify current coverage dates and update patient information |
| Claim Rejected | Submitted claim was rejected by payer | Review rejection reason and correct claim data before resubmission |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-experian-health/issues)
- **Experian Health API Documentation**: [Developer Portal](https://developer.experianhealth.com)
- **Healthcare EDI Standards**: [X12 Implementation Guides](https://x12.org/standards/hipaa-implementation-guides)