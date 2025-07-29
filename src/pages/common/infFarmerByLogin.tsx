import { useSelector } from 'react-redux';
import {  useState } from 'react';
import type { RootState } from '../../app/store.ts';
import {Container, Alert, Spinner, Card, Form, Button} from 'react-bootstrap';

type FarmerDTo = {
    _login:string;
    _firstName:string;
    _lastName:string;
    _address:string;
    _phone:number;
    _mail:string;
    _postCode:number;
    _role:string;
};

const InfFarmerByLogin = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [infFarmer, setinfFarmer] = useState<FarmerDTo | null>(null);
    const [loginFarmer, setloginFarmer] = useState('');
    const GetFarmerByLogin = async () => {
        try {
            setError(null);
            setSuccess(null);
            setLoading(true);

            const response = await fetch(`http://localhost:8080/apifarm/infFarmerByLogin/${loginFarmer}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to find farmer');
            }

            setinfFarmer(data);
            setSuccess('Information of farmer is loaded');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Information about farmer by his login</h2>
    <Form>
    <Form.Group className="mb-3">
        <Form.Label>Please enter login of farmer</Form.Label>
    <Form.Control
    type="text"
    value={loginFarmer}
    onChange={(e) => setloginFarmer(e.target.value)}
    />
    </Form.Group>
    </Form>

    <Button onClick={GetFarmerByLogin} disabled={!token || !loginFarmer} className="mb-3">
        Load Farmer Data
    </Button>

    <Container className="mt-4" style={{ maxWidth: '800px' }}>


    {loading && <Spinner animation="border" />}
    {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

            <div className="row" style={{ width: '95%', marginLeft: '5%' }}>
            {!loading && infFarmer ? (
                <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                    <Card>
                        <Card.Body>
                            <ul>
                                <li><p><strong>Farmer login:</strong> {infFarmer._login}</p></li>
                                <li><p><strong>Farmer name:</strong> {infFarmer._firstName}</p></li>
                                <li><p><strong>Farmer lastName:</strong> {infFarmer._lastName}</p></li>
                                <li><p><strong>Farmer address:</strong> {infFarmer._address}</p></li>
                                <li><p><strong>Farmer phone:</strong> {infFarmer._phone}</p></li>
                                <li><p><strong>Farmer mail:</strong> {infFarmer._mail}</p></li>
                                <li><p><strong>Farmer postcode:</strong> {infFarmer._postCode}</p></li>
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

export default InfFarmerByLogin;