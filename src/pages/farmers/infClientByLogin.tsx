import { useSelector } from 'react-redux';
import {  useState } from 'react';
import type { RootState } from '../../app/store.ts';
import {Container, Alert, Spinner, Card, Form, Button} from 'react-bootstrap';
import {jwtDecode} from "jwt-decode";

type ClientDTo = {
    _login:string;
    _firstName:string;
    _lastName:string;
    _address:string;
    _phone:number;
    _mail:string;
    _postCode:number;
    _role:string;
};

type TokenPayload = {
    login: string;
    role: string;
};

const InfClientByLogin = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [infClient, setinfClient] = useState<ClientDTo | null>(null);
    const [loginClient, setloginClient] = useState('');
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    const baseURL = import.meta.env.VITE_API_URL;
    const GetClientByLogin = async () => {
        try {
            setError(null);
            setSuccess(null);
            setLoading(true);

            const response = await fetch(`${baseURL}/apifarm/infClientByLogin/${loginClient}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to find client');
            }

            setinfClient(data);
            setSuccess('Information of client is loaded');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
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
        <div>
            <h2>Information about client by his login</h2>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Please enter login of client</Form.Label>
                    <Form.Control
                        type="text"
                        value={loginClient}
                        onChange={(e) => setloginClient(e.target.value)}
                    />
                </Form.Group>
            </Form>

            <Button onClick={GetClientByLogin} disabled={!token || !loginClient} className="mb-3">
                Load Client Data
            </Button>

            <Container className="mt-4" style={{ maxWidth: '800px' }}>


                {loading && <Spinner animation="border" />}
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <div className="row" style={{ width: '95%', marginLeft: '5%' }}>
                    {!loading && infClient ? (
                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                            <Card>
                                <Card.Body>
                                    <ul>
                                        <li><p><strong>Client login:</strong> {infClient._login}</p></li>
                                        <li><p><strong>Client name:</strong> {infClient._firstName}</p></li>
                                        <li><p><strong>Client lastName:</strong> {infClient._lastName}</p></li>
                                        <li><p><strong>Client address:</strong> {infClient._address}</p></li>
                                        <li><p><strong>Client phone:</strong> {infClient._phone}</p></li>
                                        <li><p><strong>Client mail:</strong> {infClient._mail}</p></li>
                                        <li><p><strong>Client postcode:</strong> {infClient._postCode}</p></li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </div>
                    ) : null}
                </div>
            </Container>
        </div>
    );
};

export default InfClientByLogin;