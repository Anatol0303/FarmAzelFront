import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import type { RootState } from '../../app/store';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';

type TokenPayload = {
    login: string;
    role: string;
};

const UpdateFarmer = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState<number | ''>('');
    const [mail, setMail] = useState('');
    const [postCode, setPostCode] = useState<number | ''>('');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const baseURL = import.meta.env.VITE_API_URL;
    const loginFromToken = token ? (jwtDecode(token) as TokenPayload).login : null;
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    useEffect(() => {
        const fetchFarmerData = async () => {
            try {
                setLoading(true);
                if (roleFromToken !== 'farmer')
                    throw new Error('You are not registered as farmer. Operation is forbidden');
                const response = await fetch(`${baseURL}/apifarm/infFarmerByLogin/${loginFromToken}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch your account data');
                }

                const data = await response.json();

                setFirstName(data._firstName);
                setLastName(data._lastName);
                setAddress(data._address);
                setPhone(data._phone);
                setMail(data._mail);
                setPostCode(data._postCode);

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (token && loginFromToken) {
            fetchFarmerData();
        }
    }, [token, loginFromToken]);

    const handleUpdate = async () => {
        try {
            setError(null);
            setSuccess(null);

            const response = await fetch(`${baseURL}/apifarm/updateFarmer`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    address,
                    phone: Number(phone),
                    mail,
                    postCode: Number(postCode),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // if (response.status === 403) {
                //     throw new Error('You are not registered as farmer. Operation is forbidden');
                // }
                throw new Error(data.message || 'Failed to delete farmer');
            }



            setSuccess('Your account is successfully updated');
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '800px' }}>
            <h2>Update Farmer Info</h2>

            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {!loading && (
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="number" value={phone} onChange={(e) => setPhone(Number(e.target.value))} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={mail} onChange={(e) => setMail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Post Code</Form.Label>
                        <Form.Control type="number" value={postCode} onChange={(e) => setPostCode(Number(e.target.value))} />
                    </Form.Group>

                    <Button onClick={handleUpdate} disabled={!token || !loginFromToken}>
                        Update Farmer
                    </Button>
                </Form>
            )}
        </Container>
    );
};

export default UpdateFarmer;