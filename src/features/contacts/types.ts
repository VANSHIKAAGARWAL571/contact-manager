export interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  // New fields for the form
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  pincode?: string;
}

