import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../../app/store';
import { Alert, Container, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import {useNavigate} from 'react-router-dom';
import {setToken} from "../../store/slices/authSlice.ts";
import {setRole} from "../../store/slices/roleSlice.ts";

type TokenPayload = {
    login: string;
    role: string;
};

const DeleteClient = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const loginFromToken = token ? (jwtDecode(token) as TokenPayload).login : null;
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    const handleDelete = async () => {
        try {
            setError(null);
            setSuccess(null);
            const response = await fetch('http://localhost:8080/apifarm/deleteClient', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete your account');
            }

            setSuccess('Your account is successfully deleted');
            dispatch(setToken(''));
            dispatch(setRole(null));
            localStorage.setItem('token', '');
            localStorage.setItem('role', '');
            navigate('/');
        } catch (err) {
            setError((err as Error).message);
        }
    };
    if (roleFromToken !== 'client') {
        return (
            <Container className="mt-4" style={{ maxWidth: '800px' }}>
                <Alert variant="danger">You are not registered as client. Operation is forbidden</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4" style={{maxWidth: '800px'}}>
            <h2>Deleting your account</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button onClick={handleDelete} disabled={!token || !loginFromToken}>
                Delete
            </Button>
        </Container>
    );
};

export default DeleteClient;