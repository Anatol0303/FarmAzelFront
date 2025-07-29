import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import type { RootState } from '../../app/store';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';

type TokenPayload = {
    login: string;
    role: string;
};

const UpdateClient = () => {
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

    const loginFromToken = token ? (jwtDecode(token) as TokenPayload).login : null;
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    //const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role.toLowerCase() : null;
    useEffect(() => {
        const fetchClientData = async () => {
            try {
                setLoading(true);
                if (token !== null)
                console.log('Decoded token:', jwtDecode(token));
                if (roleFromToken !== 'client')
                    throw new Error('You are not registered as client. Operation is forbidden');

                const response = await fetch(`http://localhost:8080/apifarm/infClientByLogin/${loginFromToken}`, {
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
            fetchClientData();
        }
    }, [token, loginFromToken]);

    const handleUpdate = async () => {
        try {
            setError(null);
            setSuccess(null);

            const response = await fetch('http://localhost:8080/apifarm/updateClient', {
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
                throw new Error(data.message || 'Failed to update your account');
            }


            setSuccess('Your account successfully updated');
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
        <Container className="mt-4" style={{ maxWidth: '800px' }}>
            <h2>Update Client Info</h2>

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
                        Update account
                    </Button>
                </Form>
            )}
        </Container>
    );
};

export default UpdateClient;