import React from 'react';
import type { Contact } from '../types';

interface ContactDetailsModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({
  contact,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Contact Details</h2>
          <button className="icon-button close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body details-body">
          <div className="details-row">
            <span className="details-label">Full Name</span>
            <span className="details-value">{contact.fullName}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Email</span>
            <span className="details-value">{contact.email}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Phone</span>
            <span className="details-value">{contact.phone}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Address</span>
            <span className="details-value">{contact.address}</span>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

