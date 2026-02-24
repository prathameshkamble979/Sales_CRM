import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeads, getAllUsers } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalLeads: 0,
        newLeads: 0,
        contactedLeads: 0,
        qualifiedLeads: 0,
        lostLeads: 0,
        totalUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const leadsRes = await getLeads();
                const leads = leadsRes.data;

                const newStats = {
                    totalLeads: leads.length,
                    newLeads: leads.filter((l) => l.status === 'New').length,
                    contactedLeads: leads.filter((l) => l.status === 'Contacted').length,
                    qualifiedLeads: leads.filter((l) => l.status === 'Qualified').length,
                    lostLeads: leads.filter((l) => l.status === 'Lost').length,
                    totalUsers: 0,
                };

                if (user.role === 'admin') {
                    const usersRes = await getAllUsers();
                    newStats.totalUsers = usersRes.data.length;
                }

                setStats(newStats);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user.role]);

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="page-header">
                    <h2>Dashboard</h2>
                    <p>Welcome back, <strong>{user.name}</strong>! Here's your overview.</p>
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>{stats.totalLeads}</h3>
                                <p>Total Leads</p>
                            </div>
                            <div className="stat-card">
                                <h3>{stats.newLeads}</h3>
                                <p>New</p>
                            </div>
                            <div className="stat-card">
                                <h3>{stats.contactedLeads}</h3>
                                <p>Contacted</p>
                            </div>
                            <div className="stat-card">
                                <h3>{stats.qualifiedLeads}</h3>
                                <p>Qualified</p>
                            </div>
                            <div className="stat-card">
                                <h3>{stats.lostLeads}</h3>
                                <p>Lost</p>
                            </div>
                            {user.role === 'admin' && (
                                <div className="stat-card">
                                    <h3>{stats.totalUsers}</h3>
                                    <p>Total Users</p>
                                </div>
                            )}
                        </div>

                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-links">
                                <Link to="/leads" className="btn btn-primary">View Leads</Link>
                                <Link to="/leads/new" className="btn btn-secondary">Add Lead</Link>
                                {user.role === 'admin' && (
                                    <Link to="/users" className="btn btn-secondary">Manage Users</Link>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Dashboard;
