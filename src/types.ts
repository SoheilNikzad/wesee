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
  rejectionReason?: string;
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

export type MarketType = 'iran-cex' | 'global-cex' | 'dex';

export interface TargetMarket {
  id: string;
  name: string;
  nameFa: string;
  type: MarketType;
  badge: string;
  description: string;
  icon?: string;
  popular?: boolean;
}

export type ListingStatus = 'submitted' | 'under_review' | 'docs_required' | 'sent_to_exchanges' | 'approved' | 'rejected';

export interface ListingApplication {
  id: string;
  trackingCode: string;
  createdAt: string;
  status: ListingStatus;
  statusLabelFa: string;
  targetMarkets: string[]; // Market IDs
  
  // Section 1: Applicant info
  requestTopic: string;
  applicantRole: string;
  entityName: string;
  nationalId?: string;
  representativeName: string;
  representativePhone: string;
  representativeEmail: string;
  projectWebsite: string;
  
  // Section 2: Token & Asset info
  tokenName: string;
  tokenSymbol: string;
  tokenCurrentStatus: string;
  underlyingAssetCategory: string;
  underlyingAssetIntro: string;
  tokenHolderRights: string[];
  assetOwnerOrObligor: string;
  ownershipProofStatus: string;
  tokenEconomicsSummary: string;
  blockchainNetwork: string;
  smartContractAddress?: string;
  
  // Section 3: Legal & Readiness
  regulatoryStatus: string;
  availableDocuments: string[];
  documentsDriveLink?: string;
  expectedListingTimeline: string;
  
  // Section 4: Notes
  additionalNotes?: string;
  termsConfirmed: boolean;
}

