import { useSelector } from 'react-redux';
import {  useState } from 'react';
import type { RootState } from '../../app/store';
import {Container, Alert, Spinner, Card, Form, Button} from 'react-bootstrap';
import {jwtDecode} from "jwt-decode";

type SurprizeBackTo = {
    _loginFarmer: string;
    _description: string;
    _product: string;
    _loginClient: string;
    _nameSB: string;
};

type TokenPayload = {
    login: string;
    role: string;
};


const InfSBByNameSB = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [SBByNameSB, setSBByNameSB] = useState<SurprizeBackTo | null>(null);
    const [nameSB, setnameSB] = useState('');
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    const GetSurprizeBackByName = async () => {
        try {
            setError(null);
            setSuccess(null);
            setLoading(true);
            const response = await fetch(`http://localhost:8080/apifarm/infSBByNameSB/${nameSB}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`You do not have surprizeBack with name ${nameSB}`);
                }
                console.log(data.message);
                throw new Error(data.message || 'Failed to get information of surprizeback');
            }

            setSBByNameSB(data);
            setSuccess('Information of surprizeback by its name is successfully loaded');
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
        <h2>Information about surprizeBack by its name</h2>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Please enter Name of SurprizeBack</Form.Label>
                <Form.Control
                    type="text"
                    value={nameSB}
                    onChange={(e) => setnameSB(e.target.value)}
                />
            </Form.Group>
        </Form>

        <Button onClick={GetSurprizeBackByName} disabled={!token || !nameSB} className="mb-3">
            Load SurprizeBack Data
        </Button>

        <Container className="mt-4" style={{ maxWidth: '800px' }}>


            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="row" style={{ width: '95%', marginLeft: '5%' }}>
                {!loading && SBByNameSB ? (
                    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                        <Card>
                            <Card.Body>
                                <ul>
                                    <li><p><strong>Name:</strong> {SBByNameSB._nameSB}</p></li>
                                    <li><p><strong>Description:</strong> {SBByNameSB._description}</p></li>
                                    <li><p><strong>Product:</strong> {SBByNameSB._product}</p></li>
                                    <li><p><strong>Ordered by Client:</strong> {SBByNameSB._loginClient}</p></li>
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

export default InfSBByNameSB;