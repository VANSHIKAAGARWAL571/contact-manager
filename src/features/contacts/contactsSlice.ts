import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Contact } from './types';

export interface ContactsState {
  items: Contact[];
}

const defaultInitialState: ContactsState = {
  items: [
    {
      id: '1',
      fullName: 'Priya Sharma',
      email: 'example.priya@gmail.com',
      phone: '98734 8332',
      address: 'Plot No. 57, Industrial Area Phase 2, Chandigarh, Punjab, 160002',
    },
    {
      id: '2',
      fullName: 'Rahul Mehta',
      email: 'example.rahul@example.com',
      phone: '91234 8332',
      address: 'Unit 4B, MIDC Taloja, Sector 10, Navi Mumbai, Maharashtra, 410208',
    },
    {
      id: '3',
      fullName: 'Sneha Rao',
      email: 'example.sneha@example.com',
      phone: '82734 8332',
      address: 'Khasra No. 432, Village Behrampur, Sector 59, Gurugram, Haryana, 122101',
    },
    {
      id: '4',
      fullName: 'Tanvi Verma',
      email: 'example.tanvi@example.com',
      phone: '93734 8332',
      address:
        'Building 12, Tech Park, Electronic City, Bengaluru, Karnataka, 560100',
    },
    {
      id: '5',
      fullName: 'Gaurav Agarwal',
      email: 'example.gaurav@example.com',
      phone: '94234 8332',
      address: 'Plot No. 23, Sector 15, Noida, Uttar Pradesh, 201301',
    },
    {
      id: '6',
      fullName: 'Ritika Singh',
      email: 'example.ritika@example.com',
      phone: '86543 2109',
      address:
        'Flat 402, Gold Nest, Lokhandwala Complex, Andheri, Mumbai, Maharashtra, 400053',
    },
    {
      id: '7',
      fullName: 'Kavya Gupta',
      email: 'example.kavya@example.com',
      phone: '97654 3210',
      address:
        'Survey No. 45, Near Railway Station, Jodhpur, Rajasthan, 342001',
    },
  ],
};

const STORAGE_KEY = 'contacts';

const getInitialState = (): ContactsState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('✓ Loaded contacts from localStorage:', parsed.items.length, 'items');
      return parsed;
    }
  } catch (error) {
    console.error('✗ Failed to load contacts from localStorage:', error);
  }
  console.log('ℹ Using default initial contacts');
  return defaultInitialState;
};

const initialState = getInitialState();

interface AddContactPayload {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface UpdateContactPayload extends AddContactPayload {
  id: string;
}

const saveToLocalStorage = (state: ContactsState) => {
  try {
    // Convert Immer proxies to plain objects
    const plainState: ContactsState = {
      items: state.items.map(item => ({
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        address: item.address,
      }))
    };
    const dataToSave = JSON.stringify(plainState);
    localStorage.setItem(STORAGE_KEY, dataToSave);
    console.log('✓ Contacts saved to localStorage:', state.items.length, 'items');
    // Verify it was saved
    const verify = localStorage.getItem(STORAGE_KEY);
    console.log('Verified in storage:', verify ? 'YES ✓' : 'NO ✗');
  } catch (error) {
    console.error('✗ Failed to save contacts to localStorage:', error);
  }
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<AddContactPayload>) => {
      const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      state.items.push({ id, ...action.payload });
      saveToLocalStorage(state);
    },
    updateContact: (state, action: PayloadAction<UpdateContactPayload>) => {
      const idx = state.items.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
        saveToLocalStorage(state);
      }
    },
    deleteContact: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
      saveToLocalStorage(state);
    },
    deleteManyContacts: (state, action: PayloadAction<string[]>) => {
      const ids = new Set(action.payload);
      state.items = state.items.filter((c) => !ids.has(c.id));
      saveToLocalStorage(state);
    },
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.items = action.payload;
      saveToLocalStorage(state);
    },
  },
});

export const {
  addContact,
  updateContact,
  deleteContact,
  deleteManyContacts,
  setContacts,
} = contactsSlice.actions;

export default contactsSlice.reducer;

