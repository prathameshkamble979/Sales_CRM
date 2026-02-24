import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    getLeadById,
    deleteLead,
    getDealsByLead,
    createDeal,
    updateDeal,
    deleteDeal,
    getActivitiesByLead,
    createActivity,
    deleteActivity,
} from '../services/api';
import Navbar from '../components/Navbar';

const DEAL_STAGES = ['Prospect', 'Negotiation', 'Won', 'Lost'];
const ACTIVITY_TYPES = ['Call', 'Meeting', 'Note', 'Follow-up'];

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [lead, setLead] = useState(null);
    const [deals, setDeals] = useState([]);
    const [activities, setActivities] = useState([]);
    const [stageFilter, setStageFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Deal form state
    const [dealForm, setDealForm] = useState({ title: '', value: '', stage: 'Prospect', notes: '' });
    const [dealError, setDealError] = useState('');
    const [showDealForm, setShowDealForm] = useState(false);

    // Activity form state
    const [activityForm, setActivityForm] = useState({ type: 'Call', description: '' });
    const [activityError, setActivityError] = useState('');
    const [showActivityForm, setShowActivityForm] = useState(false);

    // Edit deal state
    const [editingDealId, setEditingDealId] = useState(null);
    const [editDealStage, setEditDealStage] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [leadRes, dealsRes, activitiesRes] = await Promise.all([
                    getLeadById(id),
                    getDealsByLead(id),
                    getActivitiesByLead(id),
                ]);
                setLead(leadRes.data);
                setDeals(dealsRes.data);
                setActivities(activitiesRes.data);
            } catch (err) {
                setError('Failed to load lead details');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    const handleDeleteLead = async () => {
        if (!window.confirm('Delete this lead? All associated deals and activities will be lost.')) return;
        try {
            await deleteLead(id);
            navigate('/leads');
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    // --- Deals ---
    const handleCreateDeal = async (e) => {
        e.preventDefault();
        if (!dealForm.title.trim()) return setDealError('Title is required');
        setDealError('');
        try {
            const res = await createDeal({ ...dealForm, leadId: id, value: Number(dealForm.value) || 0 });
            setDeals((prev) => [res.data, ...prev]);
            setDealForm({ title: '', value: '', stage: 'Prospect', notes: '' });
            setShowDealForm(false);
        } catch (err) {
            setDealError(err.response?.data?.message || 'Failed to create deal');
        }
    };

    const handleUpdateDealStage = async (dealId) => {
        try {
            const res = await updateDeal(dealId, { stage: editDealStage });
            setDeals((prev) => prev.map((d) => (d._id === dealId ? res.data : d)));
            setEditingDealId(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    const handleDeleteDeal = async (dealId) => {
        if (!window.confirm('Delete this deal?')) return;
        try {
            await deleteDeal(dealId);
            setDeals((prev) => prev.filter((d) => d._id !== dealId));
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    // --- Activities ---
    const handleCreateActivity = async (e) => {
        e.preventDefault();
        if (!activityForm.description.trim()) return setActivityError('Description is required');
        setActivityError('');
        try {
            const res = await createActivity({ ...activityForm, leadId: id });
            setActivities((prev) => [res.data, ...prev]);
            setActivityForm({ type: 'Call', description: '' });
            setShowActivityForm(false);
        } catch (err) {
            setActivityError(err.response?.data?.message || 'Failed to log activity');
        }
    };

    const handleDeleteActivity = async (activityId) => {
        if (!window.confirm('Delete this activity?')) return;
        try {
            await deleteActivity(activityId);
            setActivities((prev) => prev.filter((a) => a._id !== activityId));
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    const filteredDeals = stageFilter ? deals.filter((d) => d.stage === stageFilter) : deals;

    if (loading) return <><Navbar /><div className="container loading">Loading...</div></>;
    if (error) return <><Navbar /><div className="container"><div className="alert alert-error">{error}</div></div></>;

    return (
        <>
            <Navbar />
            <div className="container">
                {/* Lead Info */}
                <div className="page-header">
                    <div>
                        <h2>{lead.name}</h2>
                        <span className={`badge badge-${lead.status.toLowerCase()}`}>{lead.status}</span>
                    </div>
                    <div className="action-links">
                        <Link to={`/leads/${id}/edit`} className="btn btn-secondary">Edit</Link>
                        <button onClick={handleDeleteLead} className="btn btn-danger">Delete</button>
                    </div>
                </div>

                <div className="detail-card">
                    <div className="detail-grid">
                        <div><strong>Email:</strong> {lead.email}</div>
                        <div><strong>Phone:</strong> {lead.phone || '-'}</div>
                        <div><strong>Company:</strong> {lead.company || '-'}</div>
                        <div><strong>Source:</strong> {lead.source || '-'}</div>
                        <div><strong>Assigned To:</strong> {lead.assignedTo?.name || '-'}</div>
                        <div><strong>Created:</strong> {new Date(lead.createdAt).toLocaleDateString()}</div>
                    </div>
                    {lead.notes && (
                        <div className="notes-section">
                            <strong>Notes:</strong>
                            <p>{lead.notes}</p>
                        </div>
                    )}
                </div>

                {/* Deals Section */}
                <div className="section">
                    <div className="section-header">
                        <h3>Deals ({deals.length})</h3>
                        <div className="section-actions">
                            <select
                                value={stageFilter}
                                onChange={(e) => { setStageFilter(e.target.value); }}
                                className="filter-select-sm"
                            >
                                <option value="">All Stages</option>
                                {DEAL_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowDealForm(!showDealForm)}>
                                {showDealForm ? 'Cancel' : '+ Add Deal'}
                            </button>
                        </div>
                    </div>

                    {showDealForm && (
                        <form onSubmit={handleCreateDeal} className="inline-form">
                            {dealError && <div className="alert alert-error">{dealError}</div>}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Title *</label>
                                    <input
                                        type="text"
                                        value={dealForm.title}
                                        onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                                        placeholder="Deal title"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Value ($)</label>
                                    <input
                                        type="number"
                                        value={dealForm.value}
                                        onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stage</label>
                                    <select
                                        value={dealForm.stage}
                                        onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })}
                                    >
                                        {DEAL_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Notes</label>
                                <input
                                    type="text"
                                    value={dealForm.notes}
                                    onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })}
                                    placeholder="Optional notes"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-sm">Create Deal</button>
                        </form>
                    )}

                    {filteredDeals.length === 0 ? (
                        <p className="empty-text">No deals yet.</p>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Value</th>
                                        <th>Stage</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDeals.map((deal) => (
                                        <tr key={deal._id}>
                                            <td>{deal.title}</td>
                                            <td>${deal.value.toLocaleString()}</td>
                                            <td>
                                                {editingDealId === deal._id ? (
                                                    <select
                                                        value={editDealStage}
                                                        onChange={(e) => setEditDealStage(e.target.value)}
                                                    >
                                                        {DEAL_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                ) : (
                                                    <span className={`badge badge-deal-${deal.stage.toLowerCase()}`}>{deal.stage}</span>
                                                )}
                                            </td>
                                            <td>
                                                {editingDealId === deal._id ? (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleUpdateDealStage(deal._id)}
                                                        >Save</button>
                                                        <button
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() => setEditingDealId(null)}
                                                        >Cancel</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => { setEditingDealId(deal._id); setEditDealStage(deal.stage); }}
                                                        >Edit Stage</button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteDeal(deal._id)}
                                                        >Delete</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Activities Section */}
                <div className="section">
                    <div className="section-header">
                        <h3>Activity History ({activities.length})</h3>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowActivityForm(!showActivityForm)}>
                            {showActivityForm ? 'Cancel' : '+ Log Activity'}
                        </button>
                    </div>

                    {showActivityForm && (
                        <form onSubmit={handleCreateActivity} className="inline-form">
                            {activityError && <div className="alert alert-error">{activityError}</div>}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type</label>
                                    <select
                                        value={activityForm.type}
                                        onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
                                    >
                                        {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Description *</label>
                                    <input
                                        type="text"
                                        value={activityForm.description}
                                        onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                                        placeholder="Describe the activity..."
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-sm">Log Activity</button>
                        </form>
                    )}

                    {activities.length === 0 ? (
                        <p className="empty-text">No activities logged yet.</p>
                    ) : (
                        <div className="activity-list">
                            {activities.map((activity) => (
                                <div key={activity._id} className="activity-item">
                                    <div className="activity-header">
                                        <span className={`badge badge-activity-${activity.type.toLowerCase().replace('-', '')}`}>
                                            {activity.type}
                                        </span>
                                        <span className="activity-date">
                                            {new Date(activity.date).toLocaleDateString()} — by {activity.createdBy?.name}
                                        </span>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteActivity(activity._id)}
                                        >Delete</button>
                                    </div>
                                    <p className="activity-description">{activity.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LeadDetail;
