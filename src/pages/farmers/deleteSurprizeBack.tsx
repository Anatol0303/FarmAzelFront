import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../../app/store';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import {jwtDecode} from "jwt-decode";

type TokenPayload = {
    login: string;
    role: string;
};

const RemoveSurprizeBack = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [nameSB, setNameSB] = useState('');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    const baseURL = import.meta.env.VITE_API_URL;
    const handleDeleteSurprizeBack = async () => {
        try {
            setError(null);
            setSuccess(null);
            if (!nameSB)
            {
                throw new Error('Error! Name of surprizeback is required');
            }
            const response = await fetch(`${baseURL}/apifarm/removeSurprizeBack/${nameSB}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({  nameSB }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete surprizeback');
            }
            setSuccess('SurprizeBack successfully deleted!');
            setNameSB('');
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
        <Container className="mt-4" style={{ maxWidth: '600px' }}>
            <h2>Delete SurprizeBack</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form>

                <Form.Group className="mb-3">
                    <Form.Label>Name SurprizeBack</Form.Label>
                    <Form.Control
                        type="text"
                        value={nameSB}
                        onChange={(e) => setNameSB(e.target.value)}
                        placeholder="Enter unique name"
                    />
                </Form.Group>

                <Button onClick={handleDeleteSurprizeBack} disabled={!token}>
                    Delete SurprizeBack
                </Button>
            </Form>
        </Container>
    );
};

export default RemoveSurprizeBack;