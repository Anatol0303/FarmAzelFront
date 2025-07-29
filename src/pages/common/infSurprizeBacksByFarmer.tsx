import { useSelector } from 'react-redux';
import {  useState } from 'react';
import type { RootState } from '../../app/store.ts';
import {Container, Alert, Spinner, Card, Form, Button} from 'react-bootstrap';

type SurprizeBackTo = {
    _loginFarmer:string;
    _description:string;
    _product:string;
    _loginClient:string;
    _nameSB:string;
};

const InfSurprizeBacksByFarmer = () => {
        const token = useSelector((state: RootState) => state.auth.token);
        const [success, setSuccess] = useState<string | null>(null);
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState<boolean>(false);
        const [infSurprizeBacks, setinfSurprizeBacks] = useState<SurprizeBackTo[] | null>(null);
        const [loginFarmer, setLoginFarmer] = useState('');
        const GetSurprizeBacksByFarmer = async () => {
            try {
                setError(null);
                setSuccess(null);
                setLoading(true);
                setinfSurprizeBacks(null);
                const response = await fetch(`http://localhost:8080/apifarm/InfSurprizeBacksByFarmer/${loginFarmer}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    console.log(data.message);
                    throw new Error(data.message || `Failed to find SurprizeBacks of farmer with login ${loginFarmer}`);
                }

                setinfSurprizeBacks(data);
                setSuccess(`Information of SurprizeBacks of farmer with login ${loginFarmer} is loaded`);
            } catch (err) {

                setError((err as Error).message);
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        return (
            <Container fluid className="py-4">
                <h2 className="text-center mb-4">SurprizeBacks by Farmer</h2>

                <Form className="mb-3 text-center">
                    <Form.Group controlId="productInput">
                        <Form.Label>Enter Farmer Login</Form.Label>
                        <Form.Control
                            type="text"
                            value={loginFarmer}
                            onChange={(e) => setLoginFarmer(e.target.value)}
                            style={{ maxWidth: '400px', margin: '0 auto' }}
                        />
                    </Form.Group>
                    <Button
                        className="mt-2"
                        onClick={GetSurprizeBacksByFarmer}
                        disabled={!loginFarmer || !token}
                    >
                        Load
                    </Button>
                </Form>

                {loading && <Spinner animation="border" className="d-block mx-auto" />}
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <div className="row justify-content-center">
                    {infSurprizeBacks?.length && infSurprizeBacks.map((sb, idx) => (
                        <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                            <Card className="h-100 shadow text-center">
                                <Card.Body>
                                    <Card.Title>SurprizeBack name: {sb._nameSB}</Card.Title>
                                    <Card.Text>
                                        <strong>Product:</strong> {sb._product}<br/>
                                        <strong>Description:</strong> {sb._description}<br/>
                                        <strong>Customer:</strong> {sb._loginClient}<br/>
                                        <strong>Farmer:</strong> {sb._loginFarmer}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </Container>
        );

    }
;

export default InfSurprizeBacksByFarmer;