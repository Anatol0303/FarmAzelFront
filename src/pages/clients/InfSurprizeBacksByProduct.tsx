import { useSelector } from 'react-redux';
import {  useState } from 'react';
import type { RootState } from '../../app/store';
import {Container, Alert, Spinner, Card, Form, Button} from 'react-bootstrap';
import {jwtDecode} from "jwt-decode";

type SurprizeBackTo = {
    _loginFarmer:string;
    _description:string;
    _product:string;
    _loginClient:string;
    _nameSB:string;
};

type TokenPayload = {
    login: string;
    role: string;
};


const InfSurprizeBacksByProduct = () => {
        const token = useSelector((state: RootState) => state.auth.token);
        const [success, setSuccess] = useState<string | null>(null);
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState<boolean>(false);
        const [infSurprizeBacks, setinfSurprizeBacks] = useState<SurprizeBackTo[] | null>(null);
        const [product, setProduct] = useState('');
        const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
        const GetSurprizeBacksByProduct = async () => {
            try {
                setError(null);
                setSuccess(null);
                setLoading(true);
                setinfSurprizeBacks(null);
                const response = await fetch(`http://localhost:8080/apifarm/InfSurprizeBacksByProduct/${product}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to find surprizeback by this product');
                }

                setinfSurprizeBacks(data);
                setSuccess(`Information of SurprizeBacks with ${product} is loaded`);
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
            <Container fluid className="py-4">
                <h2 className="text-center mb-4">SurprizeBacks by Product</h2>

                <Form className="mb-3 text-center">
                    <Form.Group controlId="productInput">
                        <Form.Label>Enter product name</Form.Label>
                        <Form.Control
                            type="text"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            style={{ maxWidth: '400px', margin: '0 auto' }}
                        />
                    </Form.Group>
                    <Button
                        className="mt-2"
                        onClick={GetSurprizeBacksByProduct}
                        disabled={!product || !token}
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

export default InfSurprizeBacksByProduct;