import React, { useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addContact } from '../contactsSlice';
import type { AppDispatch } from '../../../store';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  pincode: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  pincode?: string;
}

const initialFormState: FormState = {
  fullName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  state: '',
  pincode: '',
};

export const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) return null;

  const isDirty = Object.values(form).some((v) => v.trim().length > 0);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(form.fullName.trim())) {
      newErrors.fullName = 'Name must contain alphabets only';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    const normalizedPhone = form.phone.replace(/\s/g, '');
    if (normalizedPhone) {
      if (!/^\d+$/.test(normalizedPhone)) {
        newErrors.phone = 'Phone must contain only digits';
      } else if (normalizedPhone.length !== 10) {
        newErrors.phone = 'Phone must be exactly 10 digits';
      }
    }
    if (!form.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address Line 1 is required';
    }
    const normalizedPincode = form.pincode.replace(/\s/g, '');
    if (!normalizedPincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d+$/.test(normalizedPincode)) {
      newErrors.pincode = 'Pincode must contain only digits';
    } else if (normalizedPincode.length !== 6) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Combine address fields for storage
    const addressParts = [form.addressLine1];
    if (form.addressLine2.trim()) {
      addressParts.push(form.addressLine2);
    }
    if (form.state.trim()) {
      addressParts.push(form.state);
    }
    if (form.pincode.trim()) {
      addressParts.push(form.pincode);
    }
    const fullAddress = addressParts.join(', ');
    
    dispatch(addContact({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: fullAddress,
    }));
    setForm(initialFormState);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Enforce "as-you-type" constraints to match UI expectations
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setForm((prev) => ({ ...prev, phone: digitsOnly }));
      return;
    }
    if (name === 'pincode') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
      setForm((prev) => ({ ...prev, pincode: digitsOnly }));
      return;
    }
    if (name === 'fullName') {
      const lettersAndSpacesOnly = value.replace(/[^A-Za-z\s]/g, '');
      setForm((prev) => ({ ...prev, fullName: lettersAndSpacesOnly }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setForm(initialFormState);
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add Contact</h2>
          <button className="icon-button close-button" onClick={handleClose} aria-label="Close">
            ✕
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">
                Name<span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                className={`form-input ${errors.fullName ? 'has-error' : ''}`}
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter name"
              />
              {errors.fullName && (
                <div className="error-text">{errors.fullName}</div>
              )}
            </div>

            <div className="form-row">
              <label className="form-label">Contact No.</label>
              <input
                type="tel"
                name="phone"
                className={`form-input ${errors.phone ? 'has-error' : ''}`}
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter contact no."
                maxLength={10}
              />
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>

            <div className="form-row">
              <label className="form-label">
                Email<span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="form-row">
              <label className="form-label">
                Address Line 1<span className="required">*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                className={`form-input ${errors.addressLine1 ? 'has-error' : ''}`}
                value={form.addressLine1}
                onChange={handleChange}
                placeholder="Enter address"
              />
              {errors.addressLine1 && (
                <div className="error-text">{errors.addressLine1}</div>
              )}
            </div>

            <div className="form-row">
              <label className="form-label">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                className="form-input"
                value={form.addressLine2}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </div>

            <div className="form-row">
              <label className="form-label">State</label>
              <select
                name="state"
                className="form-input form-select"
                value={form.state}
                onChange={handleChange}
              >
                <option value="">Enter State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Bihar">Bihar</option>
                <option value="Delhi">Delhi</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">
                Pincode<span className="required">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                className={`form-input ${errors.pincode ? 'has-error' : ''}`}
                value={form.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                maxLength={6}
              />
              {errors.pincode && (
                <div className="error-text">{errors.pincode}</div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!isDirty}>
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

