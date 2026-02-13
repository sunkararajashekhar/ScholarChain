<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ScholarChain - Decentralized Academic Ledger

ScholarChain is a blockchain-based academic credential management system that enables secure, verifiable, and tamper-proof storage of academic records using distributed ledger technology.

## Project Overview

ScholarChain leverages blockchain technology to:
- Create immutable academic records on a decentralized ledger
- Issue verifiable digital credentials
- Enable secure transcript sharing
- Integrate with existing Student Information Systems (SIS)
- Provide role-based access control for different stakeholders

---

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Gemini API Key** (for AI-powered features)

---

## Installation & Setup

### Step 1: Clone and Install Dependencies
```bash
git clone <repository-url>
cd ScholarChain
npm install
```

### Step 2: Configure Environment Variables
Create or update the `.env.local` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from: [Google AI Studio](https://ai.studio/)

### Step 3: Start the Development Server
```bash
npm run dev
```

The app will be available at: `http://localhost:3000/`

---

## User Roles & Workflows

ScholarChain supports three main user roles, each with specific permissions and workflows:

### 1. **STUDENT**
**Login Credentials:**
- Email: `prem.sagar@university.edu`
- Password: `demo123`

**Capabilities:**
- View personal academic records and transcripts
- Check GPA and course history
- Download digital credentials
- Share credentials securely with institutions
- Verify blockchain integrity of own records

**Workflow Steps:**
1. Login with student credentials
2. Access the Dashboard to view enrolled courses
3. Navigate to Block Explorer to see academic history
4. Download or share credentials as needed

---

### 2. **INSTRUCTOR**
**Login Credentials:**
- Email: `teja@university.edu`
- Password: `demo123`

**Capabilities:**
- Submit student grades and transcript data
- Add academic records to the blockchain
- View student performance analytics
- Batch import grades from spreadsheets
- Verify chain integrity

**Workflow Steps:**
1. Login with instructor credentials
2. Access "Add Transcript" feature
3. Enter student information and course details
4. Submit grades (system automatically mines the block)
5. View mined records in Block Explorer
6. Use SIS Bridge to sync with institutional database (if Registrar)

---

### 3. **REGISTRAR**
**Login Credentials:**
- Email: `rajashekhar@university.edu`
- Password: `demo123`

**Capabilities:**
- Issue digital credentials (degrees, diplomas)
- Access SIS Integration Bridge
- Manage institutional blockchain node
- Verify chain integrity
- Export bulk academic records
- Add institutional credentials to blockchain
- Manage system-wide settings

**Workflow Steps:**
1. Login with registrar credentials
2. Access Dashboard for system overview
3. Use "Add Transcript" to add bulk records
4. Navigate to "Issue Credential" to issue degrees/diplomas
5. Use "SIS Bridge" to synchronize with institutional database
6. Access Block Explorer to audit all records
7. Run chain validation to ensure integrity

---

## Core Features

### 📊 Dashboard
- Overview of all academic records
- System statistics and blockchain status
- Recent transactions and mining activity

### ⛓️ Block Explorer
- View all blocks in the chain
- Search records by student ID, name, or block hash
- Inspect detailed block information
- Verify block integrity

### ➕ Add Record
- Submit new academic records to the blockchain
- Support for transcripts and credential records
- Automatic block mining with proof-of-work
- Course information management (GPA, credits, grades)

### 🎓 Issue Credential
- Create verifiable digital credentials
- Sign credentials with institution private key
- Issue degrees, diplomas, and certificates
- Export credential data

### 🔗 SIS Integration
- Connect to institutional databases
- Sync academic records bi-directionally
- Bulk import/export functionality
- Automated registry updates

### ✅ Chain Verification
- Real-time blockchain validation
- Detect tampering attempts
- View detailed validation reports

---

## Available Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm preview
```

---

## Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v3
- **Blockchain:** Custom proof-of-work implementation
- **Crypto:** Web Crypto API (SHA-256 hashing)
- **UI Components:** Lucide React icons
- **Data Processing:** XLSX (Excel support)
- **AI Integration:** Google Gemini API
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with PostCSS

---

## Project Structure

```
ScholarChain/
├── components/
│   ├── LoginScreen.tsx          # Authentication UI
│   ├── BlockCard.tsx            # Block display component
│   ├── AddRecordForm.tsx        # Record submission form
│   ├── IssueCredential.tsx      # Credential issuance
│   └── SISIntegration.tsx       # Database bridge
├── utils/
│   ├── cryptoUtils.ts           # Blockchain & crypto logic
│   ├── excelUtils.ts            # Excel/XLSX utilities
│   └── geminiService.ts         # AI service integration
├── services/
│   └── geminiService.ts         # Google Gemini API
├── App.tsx                      # Main application component
├── types.ts                     # TypeScript type definitions
├── style.css                    # Global styles & Tailwind
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies

```

---

## Blockchain Architecture

### Block Structure
```typescript
{
  index: number           // Block position in chain
  timestamp: number       // Creation timestamp
  data: AcademicRecord   // Student academic data
  previousHash: string   // Hash of previous block
  hash: string           // Current block hash (SHA-256)
  nonce: number          // Proof-of-work nonce
}
```

### Mining Process
- Uses proof-of-work with adjustable difficulty
- SHA-256 hashing for block integrity
- Genesis block automatically created on app startup
- New blocks mined when records are submitted

---

## Security Features

- ✅ Blockchain immutability (tamper detection)
- ✅ Digital signatures for credentials
- ✅ Role-based access control (RBAC)
- ✅ Hash-based chain validation
- ✅ Proof-of-work consensus mechanism
- ✅ Secure credential signing with institution keys

---

## Data Flow

```
Student/Instructor/Registrar
    ↓
Login Authentication
    ↓
Role-Based Dashboard
    ↓
Add Record / Issue Credential
    ↓
Mine Block (Proof-of-Work)
    ↓
Add to Blockchain
    ↓
SIS Integration (Optional)
    ↓
Block Explorer View / Verification
```

---

## Troubleshooting

### Blank Screen on Load
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server: `npm run dev`
- Check browser console for errors (F12)

### Tailwind CSS Not Loading
- Ensure `style.css` is imported in `index.tsx`
- Verify PostCSS and Tailwind are installed: `npm list tailwindcss`

### Mining Slow
- This is normal for development - uses proof-of-work
- Adjust difficulty in `cryptoUtils.ts` for faster testing

### Gemini API Errors
- Verify `GEMINI_API_KEY` is set in `.env.local`
- Check API key validity in Google AI Studio

---

## Future Enhancements

- [ ] Smart contract integration (Ethereum/Polygon)
- [ ] Multi-institution federation
- [ ] IPFS integration for credential storage
- [ ] Advanced analytics dashboard
- [ ] Mobile app for student verification
- [ ] Integration with educational standards (CLR, Verifiable Credentials)
- [ ] Multi-signature credential issuance
- [ ] GraphQL API for external integrations

---

## License

This project is part of the ScholarChain Network initiative.

---

## Support

For issues, questions, or contributions, please contact:
- **Admin Contact:** admin@university.edu
- **GitHub Issues:** [Create an issue]

---

**Last Updated:** February 13, 2026
