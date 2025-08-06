import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../../app/store';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
    login: string;
    role: string;
};

const UpdateSurprizeBack = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [description, setdescription] = useState('');
    const [product, setproduct] = useState('');
    const [nameSB, setnameSB] = useState('');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const loginFromToken = token ? (jwtDecode(token) as TokenPayload).login : null;
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    const baseURL = import.meta.env.VITE_API_URL;
    const fetchSBData = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            if (!nameSB)
            {
                throw new Error('Error! Name of surprizeback is required');
            }
            const response = await fetch(`${baseURL}/apifarm/infSBByNameSB/${nameSB}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 404) {
                    throw new Error(`You do not have surprizeBack with name ${nameSB}`);
                }
                //const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update surprizeback');
            }
            const data = await response.json();

            setdescription(data._description);
            setproduct(data._product);
            setSuccess('SurprizeBack data is loaded successfully');

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setError(null);
            setSuccess(null);

            const response = await fetch(`${baseURL}/apifarm/updateSurprizeBack/${nameSB}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    description,
                    product,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete farmer');
            }

            setSuccess('SurprizeBack successfully updated');
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
            <h2>Update SurprizeBack</h2>

            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Name of SurprizeBack</Form.Label>
                    <Form.Control
                        type="text"
                        value={nameSB}
                        onChange={(e) => setnameSB(e.target.value)}
                    />
                </Form.Group>

                <Button onClick={fetchSBData} disabled={!token || !loginFromToken || !nameSB} className="mb-3">
                    Load SurprizeBack Data
                </Button>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        value={description}
                        onChange={(e) => setdescription(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Product</Form.Label>
                    <Form.Control
                        type="text"
                        value={product}
                        onChange={(e) => setproduct(e.target.value)}
                    />
                </Form.Group>

                <Button onClick={handleUpdate} disabled={!token || !loginFromToken || !nameSB || !description || !product}>
                    Update SurprizeBack
                </Button>
            </Form>
        </Container>
    );
};

export default UpdateSurprizeBack;