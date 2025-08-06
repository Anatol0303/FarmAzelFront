import { useSelector } from 'react-redux';
import {  useState } from 'react';
import type { RootState } from '../../app/store.ts';
import {Container, Alert, Spinner, Card, Button, Row, Col} from 'react-bootstrap';

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

const InfAllFarmers = () => {
        const token = useSelector((state: RootState) => state.auth.token);
        const [success, setSuccess] = useState<string | null>(null);
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState<boolean>(false);
        const [infAllFarmers, setInfAllFarmers] = useState<FarmerDTo[] | null>(null);
        const [hasSearched, setHasSearched] = useState(false);
        const baseURL = import.meta.env.VITE_API_URL;
        const GetAllFarmers = async () => {
            try {
                setError(null);
                setSuccess(null);
                setLoading(true);
                setInfAllFarmers(null);
                setHasSearched(false);

                const response = await fetch(`${baseURL}/apifarm/infAllFarmers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to find farmers');
                }

                setInfAllFarmers(data);
                setSuccess('Information of all farmers is loaded');
                setHasSearched(false);
            } catch (err) {
                setError((err as Error).message);
                setHasSearched(true);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div>
                <h2>Information about all farmers </h2>

                <Button onClick={GetAllFarmers} disabled={!token } className="mb-3">
                    Load all farmers
                </Button>

                <Container className="mt-4">
                    {loading && <Spinner animation="border" />}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    {infAllFarmers?.length ? (
                        infAllFarmers.map((infFarmer, index) => (
                            <Card key={index} className="mb-4 shadow">
                                <Card.Body>
                                    <Row>
                                        <Col md={6} ><strong>Login:</strong> {infFarmer._login}</Col>
                                        <Col md={6}><strong>Name:</strong> {infFarmer._firstName} </Col>

                                    </Row>
                                    <Row className="mt-2">
                                        <Col md={6}><strong>Address:</strong> {infFarmer._address}</Col>
                                        <Col md={6}><strong>Postcode:</strong> {infFarmer._postCode}</Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col md={6}><strong>Phone:</strong> {infFarmer._phone}</Col>
                                        <Col md={6}><strong>Email:</strong> {infFarmer._mail}</Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        hasSearched && !loading && <p>No farmers found.</p>
                    )}
                </Container>
            </div>
        );
};

export default InfAllFarmers;