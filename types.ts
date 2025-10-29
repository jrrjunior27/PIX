export interface PixSettings {
  pixKey: string;
  recipientName: string;
  city: string;
}

export interface PixTransaction {
  id: string;
  amount: string;
  date: string;
  brCode: string;
}
