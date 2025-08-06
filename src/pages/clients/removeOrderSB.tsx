import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../../app/store';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
    login: string;
    role: string;
};

const RemoveOrderSurprizeBack = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [nameSB, setNameSB] = useState('');
    const [loginFarmer, setLoginFarmer] = useState('');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const baseURL = import.meta.env.VITE_API_URL;
    const loginFromToken = token ? (jwtDecode(token) as TokenPayload).login : null;
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    const removeOrderSB = async () => {
        try {
            setError(null);
            setSuccess(null);
            setLoading(true);
            const response = await fetch(`${baseURL}/apifarm/removeOrderSB/${nameSB}/${loginFarmer}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {

                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            setSuccess('Surprizeback order is successfully deleted');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
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
        <Container className="mt-4" style={{ maxWidth: '800px' }}>
            <h2>Deleting order to SurprizeBack</h2>

            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {!loading && (
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Farmer Login</Form.Label>
                        <Form.Control type="text" value={loginFarmer} onChange={(e) => setLoginFarmer(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>SurprizeBack Name</Form.Label>
                        <Form.Control type="text" value={nameSB} onChange={(e) => setNameSB(e.target.value)} />
                    </Form.Group>

                    <Button onClick={removeOrderSB} disabled={!token || !loginFromToken || !loginFarmer || !nameSB}>
                        Delete order to surprizeback
                    </Button>
                </Form>
            )}
        </Container>
    );
};

export default RemoveOrderSurprizeBack;