import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { deleteContact, deleteManyContacts } from './contactsSlice';
import type { Contact } from './types';
import { AddContactModal } from './components/AddContactModal';
import { ContactDetailsModal } from './components/ContactDetailsModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';

export const ContactManagerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const contacts = useSelector((state: RootState) => state.contacts.items);

  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailsContact, setDetailsContact] = useState<Contact | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((c) => {
      const fieldsToSearch = [
        c.fullName,
        c.email,
        c.phone,
        c.address,
        // optional state field from contact, if present
        (c as any).state ?? '',
      ];
      return fieldsToSearch.some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(query)
      );
    });
  }, [contacts, search]);

  const allVisibleIds = filteredContacts.map((c) => c.id);
  const allVisibleSelected =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedIds.includes(id));

  const handleToggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allVisibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allVisibleIds])));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const openDetails = (contact: Contact) => {
    setDetailsContact(contact);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setDetailsContact(null);
  };

  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      dispatch(deleteContact(deleteTargetId));
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const confirmBulkDelete = () => {
    if (selectedIds.length > 0) {
      dispatch(deleteManyContacts(selectedIds));
      setSelectedIds([]);
    }
    setIsBulkDeleteModalOpen(false);
  };

  const openBulkDeleteModal = () => {
    if (selectedIds.length > 0) {
      setIsBulkDeleteModalOpen(true);
    }
  };

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar-left">
          <img
            className="brand-logo"
            src={`${process.env.PUBLIC_URL}/assets/title.png`}
            alt="ofbusiness"
          />
        </div>
      </header>

      <main className="content">
        <section className="contacts-card">
          <div className="card-header">
            <h2 className="card-title">Contact Manager</h2>
          </div>

          <div className="card-toolbar">
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search by Name, Contact, Email, State..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <img
                src={`${process.env.PUBLIC_URL}/assets/icon.png`}
                alt="Search"
                className="search-icon"
              />
            </div>
            <div className="card-toolbar-right">
              {selectedIds.length > 0 && (
                <button
                  className="btn btn-outline bulk-delete-btn"
                  onClick={openBulkDeleteModal}
                >
                  Bulk Delete ({selectedIds.length})
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Contact
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="contacts-table">
              <thead>
                <tr>
                  <th className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={handleToggleSelectAllVisible}
                    />
                  </th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th className="col-actions">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      No contacts found. Use &quot;Add Contact&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => {
                    const isChecked = selectedIds.includes(contact.id);
                    return (
                      <tr key={contact.id}>
                        <td className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectOne(contact.id)}
                          />
                        </td>
                        <td
                          className="cell-link"
                          onClick={() => openDetails(contact)}
                        >
                          {contact.fullName}
                        </td>
                        <td>{contact.phone}</td>
                        <td>{contact.email}</td>
                        <td>{contact.address}</td>
                        <td className="col-actions">
                          <div className="action-buttons-group">
                            <button
                              type="button"
                              className="icon-text-button edit-button"
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/editicon.png`}
                                alt="Edit"
                                className="action-icon"
                              />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="icon-text-button delete-button"
                              onClick={() => openDeleteModal(contact.id)}
                              aria-label="Delete contact"
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/deleteicon.png`}
                                alt="Delete"
                                className="action-icon"
                              />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ContactDetailsModal
        contact={detailsContact}
        isOpen={isDetailsOpen}
        onClose={closeDetails}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <ConfirmDeleteModal
        isOpen={isBulkDeleteModalOpen}
        title={selectedIds.length > 1 ? `Delete Contact (${selectedIds.length})` : "Delete Contact"}
        message={`Are you sure you want to delete ${selectedIds.length === 1 ? 'this' : selectedIds.length} contact${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
      />
    </div>
  );
};

