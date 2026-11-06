export type AssetCategory = 'real-estate' | 'gold' | 'equity' | 'energy' | 'agriculture';

export type BlockchainNetwork = 'bsc' | 'polygon';

export type UserRole = 'investor' | 'issuer' | 'regulator' | 'admin';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  isLoggedIn: boolean;
  loginMethod: 'google' | 'wallet' | 'guest';
}

export interface RWAAsset {
  id: string;
  title: string;
  category: AssetCategory;
  categoryLabel: string;
  location: string;
  totalValuationUSD: number;
  totalValuationIRR: number;
  tokenizedPercentage: number;
  tokenPriceUSD: number;
  totalSupply: number;
  tokensSold: number;
  expectedAPY: number; // درصد بازدهی سالانه
  rentalYield?: number;
  network: BlockchainNetwork;
  tokenSymbol: string;
  tokenName: string;
  contractAddress?: string;
  imageUrl: string;
  description: string;
  documents: { title: string; type: string; size: string }[];
  status: 'active' | 'upcoming' | 'funded';
  complianceStatus: 'pending' | 'approved' | 'rejected';
  complianceLicenseId?: string;
  minInvestmentUSD: number;
  issuerName?: string;
}

export interface TokenizeFormData {
  // Step 1: Asset Info
  title: string;
  category: AssetCategory;
  location: string;
  description: string;
  physicalProofRef: string;
  imageUrl: string;
  
  // Step 2: Financial Valuation
  totalValuationUSD: number;
  tokenizedPercentage: number;
  minInvestmentUSD: number;
  expectedAPY: number;
  rentalYield: number;

  // Step 3: Web3 & Token specs
  network: BlockchainNetwork;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
  totalSupply: number;
  hasWhitelist: boolean;
  canBurn: boolean;
  canPause: boolean;
}
