export interface User {
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
}

export interface BankAccount {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: string;
  ownerUsername: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  type: string;
  amount: number;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

export interface Beneficiary {
  id: number;
  beneficiaryName: string;
  accountNumber: string;
  bankName: string;
  createdAt: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  username: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TransferRequest {
  receiverAccountNumber: string;
  amount: number;
  description: string;
}

export interface BeneficiaryRequest {
  beneficiaryName: string;
  accountNumber: string;
  bankName: string;
}
