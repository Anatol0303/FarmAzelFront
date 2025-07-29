import { useSelector } from 'react-redux';
import {  useState } from 'react';
import type { RootState } from '../../app/store.ts';
import {Container, Alert, Spinner, Card, Form, Button, Row, Col} from 'react-bootstrap';

const InfFarmersByProduct = () => {
        const token = useSelector((state: RootState) => state.auth.token);
        const [success, setSuccess] = useState<string | null>(null);
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState<boolean>(false);
        //const [infSurprizeBacks, setinfSurprizeBacks] = useState<SurprizeBackTo[] | null>(null);
        const [product, setProduct] = useState<string>('');
        const [farmersByProduct, setFarmersByProduct] = useState<string[] | null>(null)
        const [hasSearched, setHasSearched] = useState(false);

        const GetFarmersByProduct = async () => {
            try {
                setError(null);
                setSuccess(null);
                setLoading(true);
                setFarmersByProduct(null);
                setHasSearched(false);
                const response = await fetch(`http://localhost:8080/apifarm/InfFarmersByProduct/${product}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `Failed to find Farmers with ${product}`);
                }

                setFarmersByProduct(data);
                setSuccess(`Information of farmers with ${product} is loaded`);
                setHasSearched(true);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        return (
            <Container fluid className="py-4">
                <h2 className="text-center mb-4">Farmers by Product</h2>

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
                        onClick={GetFarmersByProduct}
                        disabled={!product || !token}
                    >
                        Load
                    </Button>
                </Form>

                {loading && <Spinner animation="border" className="d-block mx-auto" />}
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <div className="row justify-content-center">
                    {farmersByProduct?.length ? (
                        farmersByProduct.map((farmer, index) => (
                            <Card key={index} className="mb-4 shadow">
                                <Card.Body>
                                    <Row>
                                        <Col md={6} ><strong>Farmer login:</strong> {farmer}</Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        hasSearched && !loading && <p>No farmers found.</p>
                    )}
                </div>
            </Container>
        );

    }
;

export default InfFarmersByProduct;