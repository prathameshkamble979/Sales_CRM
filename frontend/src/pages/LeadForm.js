import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createLead, getLeadById, updateLead } from '../services/api';
import Navbar from '../components/Navbar';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];

const LeadForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New',
        source: '',
        notes: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Load existing lead data for edit mode
    useEffect(() => {
        if (isEdit) {
            getLeadById(id)
                .then((res) => {
                    const { name, email, phone, company, status, source, notes } = res.data;
                    setFormData({ name, email, phone: phone || '', company: company || '', status, source: source || '', notes: notes || '' });
                })
                .catch(() => setError('Failed to load lead'));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!formData.name.trim()) return 'Name is required';
        if (!formData.email.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Enter a valid email';
        if (formData.phone.trim() && !/^[0-9]{7,15}$/.test(formData.phone.trim())) {
            return 'Enter a valid phone number (7-15 digits)';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) return setError(validationError);

        setLoading(true);
        setError('');
        try {
            if (isEdit) {
                await updateLead(id, formData);
            } else {
                await createLead(formData);
            }
            navigate('/leads');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save lead');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="page-header">
                    <h2>{isEdit ? 'Edit Lead' : 'Add New Lead'}</h2>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Name *</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Lead full name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="lead@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="company">Company</label>
                                <input
                                    id="company"
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Company name"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="source">Source</label>
                                <input
                                    id="source"
                                    type="text"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                    placeholder="e.g. Website, Referral"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Any notes about this lead..."
                                rows={4}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => navigate('/leads')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LeadForm;
