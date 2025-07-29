import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../../app/store';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';

type TokenPayload = {
    login: string;
    role: string;
};

const UpdateFarmerPassword = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [newPassword, setNewPassword] = useState('');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const loginFromToken = token ? (jwtDecode(token) as TokenPayload).login : null;
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    const handleUpdate = async () => {
        try {
            setError(null);
            setSuccess(null);
            const password = newPassword;
            const response = await fetch('http://localhost:8080/apifarm/updateFarmerPassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ password }),
            });
            if (!response.ok) {
                const text = await response.text();

                throw new Error(`Server error ${response.status}: ${text}`);
            }

            await response.json();
            setSuccess('Your password is successfully updated');
        } catch (err) {
            setError((err as Error).message);
        }
    };
    if (roleFromToken !== 'farmer') {
        return (
            <Container className="mt-4" style={{ maxWidth: '800px' }}>
                <Alert variant="danger">You are not registered as farmer. Operation is forbidden</Alert>
            </Container>
        );
    }



    return (

        <Container className="mt-4" style={{ maxWidth: '800px' }}>
    <h2>Update your Password</h2>

    {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

            {
                (
                <Form>
                    <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </Form.Group>

            <Button onClick={handleUpdate} disabled={!token || !loginFromToken}>
                Update your Password
            </Button>
            </Form>
            )}
            </Container>
        );
        };

        export default UpdateFarmerPassword;