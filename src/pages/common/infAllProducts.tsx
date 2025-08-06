import { useSelector } from 'react-redux';
import {  useState } from 'react';
import type { RootState } from '../../app/store.ts';
import {Container, Alert, Spinner, Card, Button, Row, Col} from 'react-bootstrap';

const InfAllProducts = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [infAllProducts, setinfAllProducts] = useState<string[] | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const baseURL = import.meta.env.VITE_API_URL;
    const GetAllProducts = async () => {
        try {
            setError(null);
            setSuccess(null);
            setLoading(true);
            setinfAllProducts(null);
            setHasSearched(false);
            const response = await fetch(`${baseURL}/apifarm/InfAllProducts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to find all products');
            }

            setinfAllProducts(data);
            setSuccess('Information of all products is loaded');
            setHasSearched(true);
        } catch (err) {
            setError((err as Error).message);
            setHasSearched(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Information about all products </h2>

            <Button onClick={GetAllProducts} disabled={!token } className="mb-3">
                Load all products
            </Button>

            <Container className="mt-4">
                {loading && <Spinner animation="border" />}
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {infAllProducts?.length ? (
                    infAllProducts.map((infProduct, index) => (
                        <Card key={index} className="mb-4 shadow">
                            <Card.Body>
                                <Row>
                                    <Col md={6} ><strong>Login:</strong> {infProduct}</Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    hasSearched && !loading && <p>No products found</p>
                )}
            </Container>
        </div>
    );
};

export default InfAllProducts;