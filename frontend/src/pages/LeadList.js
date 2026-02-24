import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getLeads, deleteLead } from '../services/api';
import Navbar from '../components/Navbar';

const STATUSES = ['', 'New', 'Contacted', 'Qualified', 'Lost'];
const PAGE_SIZE = 10;

const LeadList = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const debounceTimer = useRef(null);

    // ── Debounce search input (300ms) ────────────────────────────────────
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setPage(1); // reset to page 1 on new search

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(value);
        }, 300);
    };

    // ── Fetch leads from API ─────────────────────────────────────────────
    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (debouncedSearch) params.search = debouncedSearch;
            if (status) params.status = status;
            const res = await getLeads(params);
            setLeads(res.data);
        } catch (err) {
            setError('Failed to load leads');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, status]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    // reset to page 1 when status filter changes
    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setPage(1);
    };

    // ── Delete lead ──────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            await deleteLead(id);
            setLeads((prev) => prev.filter((l) => l._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    // ── Pagination calculations ──────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(leads.length / PAGE_SIZE));
    const paginatedLeads = leads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="page-header">
                    <div>
                        <h2>Leads</h2>
                        <p style={{ marginTop: 4, fontSize: 13, color: '#6b7280' }}>
                            {leads.length} lead{leads.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                    <Link to="/leads/new" className="btn btn-primary">+ Add Lead</Link>
                </div>

                {/* Search and Filter */}
                <div className="filter-bar">
                    <input
                        type="text"
                        placeholder="Search by name, email, company..."
                        value={search}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className="filter-select"
                    >
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s === '' ? 'All Statuses' : s}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading">Loading leads...</div>
                ) : leads.length === 0 ? (
                    <div className="empty-state">
                        <p>No leads found. <Link to="/leads/new">Add one now.</Link></p>
                    </div>
                ) : (
                    <>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Company</th>
                                        <th>Status</th>
                                        <th>Assigned To</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedLeads.map((lead) => (
                                        <tr key={lead._id}>
                                            <td>
                                                <Link to={`/leads/${lead._id}`}>{lead.name}</Link>
                                            </td>
                                            <td>{lead.email}</td>
                                            <td>{lead.company || '-'}</td>
                                            <td>
                                                <span className={`badge badge-${lead.status.toLowerCase()}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td>{lead.assignedTo?.name || '-'}</td>
                                            <td>
                                                <Link to={`/leads/${lead._id}/edit`} className="btn btn-sm btn-secondary">
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(lead._id)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    ← Prev
                                </button>
                                <span className="pagination-info">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default LeadList;
