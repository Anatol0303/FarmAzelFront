import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../../app/store';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import {jwtDecode} from "jwt-decode";

type TokenPayload = {
    login: string;
    role: string;
};

const AddSurprizeBack = () => {
    const token = useSelector((state: RootState) => state.auth.token);

    const [description, setDescription] = useState('');
    const [product, setProduct] = useState('');
    const [nameSB, setNameSB] = useState('');

    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    const handleAddSurprizeBack = async () => {
        try {
            setError(null);
            setSuccess(null);
            const response = await fetch('http://localhost:8080/apifarm/addSurprizeBack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ description, product, nameSB }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add surprizeBack');
            }



            setSuccess('SurprizeBack successfully added!');
            setDescription('');
            setProduct('');
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
            (<Container className="mt-4" style={{ maxWidth: '600px' }}>
            <h2>Add SurprizeBack</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Product</Form.Label>
                    <Form.Control
                        type="text"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        placeholder="Enter product"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Name SurprizeBack</Form.Label>
                    <Form.Control
                        type="text"
                        value={nameSB}
                        onChange={(e) => setNameSB(e.target.value)}
                        placeholder="Enter unique name"
                    />
                </Form.Group>

                <Button onClick={handleAddSurprizeBack} disabled={!token}>
                    Add SurprizeBack
                </Button>
            </Form>
        </Container>)
    );
};

export default AddSurprizeBack;