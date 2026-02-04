import { Block, AcademicRecord, ChainValidationResult, RecordType } from '../types';

export const calculateHash = async (
  index: number,
  previousHash: string,
  timestamp: number,
  data: AcademicRecord,
  nonce: number
): Promise<string> => {
  const recordString = JSON.stringify(data);
  const str = index + previousHash + timestamp + recordString + nonce;
  
  // Use Web Crypto API for SHA-256
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

export const createGenesisBlock = async (): Promise<Block> => {
  const genesisData: AcademicRecord = {
    studentId: "000000",
    studentName: "Genesis Block",
    institution: "ScholarChain Network",
    program: "System Initialization",
    graduationYear: 2024,
    gpa: 4.0,
    courses: [],
    type: RecordType.TRANSCRIPT
  };
  
  const timestamp = Date.now();
  const hash = await calculateHash(0, "0", timestamp, genesisData, 0);

  return {
    index: 0,
    timestamp,
    data: genesisData,
    previousHash: "0",
    hash,
    nonce: 0
  };
};

export const mineBlock = async (
  index: number,
  previousHash: string,
  data: AcademicRecord,
  difficulty: number = 2
): Promise<Block> => {
  let nonce = 0;
  let hash = "";
  const timestamp = Date.now();
  
  while (true) {
    hash = await calculateHash(index, previousHash, timestamp, data, nonce);
    if (hash.substring(0, difficulty) === Array(difficulty + 1).join("0")) {
      break;
    }
    nonce++;
    
    // Safety break
    if (nonce > 1000000) { 
      break; 
    }
  }

  return {
    index,
    timestamp,
    data,
    previousHash,
    hash,
    nonce
  };
};

export const validateChain = async (chain: Block[]): Promise<ChainValidationResult> => {
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    if (currentBlock.previousHash !== previousBlock.hash) {
      return { isValid: false, errorBlockIndex: i, reason: "Previous hash mismatch (Broken Link)" };
    }

    const recalculatedHash = await calculateHash(
      currentBlock.index,
      currentBlock.previousHash,
      currentBlock.timestamp,
      currentBlock.data,
      currentBlock.nonce
    );

    if (currentBlock.hash !== recalculatedHash) {
      return { isValid: false, errorBlockIndex: i, reason: "Data tampering detected (Invalid Hash)" };
    }
  }
  return { isValid: true };
};

// Simulate Digital Signing (RSA/ECDSA would be used in production)
export const generateSignature = async (data: AcademicRecord, secretKey: string): Promise<string> => {
    const dataString = JSON.stringify(data) + secretKey;
    const msgBuffer = new TextEncoder().encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Simulate a signature structure
    return `sig_rsa_${hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32)}`;
}
