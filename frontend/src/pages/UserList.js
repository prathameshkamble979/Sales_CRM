import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/api';
import Navbar from '../components/Navbar';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getAllUsers()
            .then((res) => setUsers(res.data))
            .catch(() => setError('Failed to load users'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="page-header">
                    <h2>All Users</h2>
                    <span className="text-muted">{users.length} registered users</span>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading">Loading users...</div>
                ) : users.length === 0 ? (
                    <div className="empty-state"><p>No users found.</p></div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`badge badge-role-${u.role}`}>{u.role}</span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserList;
