import { useSelector } from 'react-redux';
import {useEffect, useState} from 'react';
import type { RootState } from '../../app/store';
import {Container, Alert, Spinner, Card} from 'react-bootstrap';
import {jwtDecode} from "jwt-decode";

type SurprizeBackTo = {
     _loginFarmer: string;
     _description: string;
     _product: string;
     _loginClient: string;
     _nameSB: string;
}

type TokenPayload = {
    login: string;
    role: string;
};




const InfMyOrdersSB = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [myOrderedBacks, setMyOrderedBacks] = useState<SurprizeBackTo[] | null>([]);
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    const baseURL = import.meta.env.VITE_API_URL;
        const GetOrderedSurprizeBacks = async () => {
            try {
                setError(null);
                setSuccess(null);
                setLoading(true);
                const response = await fetch(`${baseURL}/apifarm/InfOrdersSB`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to get information of your orders');
                }
                setMyOrderedBacks(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
    useEffect(() => {
        GetOrderedSurprizeBacks();
    }, []);
    if (roleFromToken !== 'farmer') {
        return (
            <Container className="mt-4" style={{ maxWidth: '800px' }}>
                <Alert variant="danger">You are not registered as farmer. Operation is forbidden</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4" style={{maxWidth: '800px'}}>
            <h2>Information about my ordered surprizeBacks</h2>

            {loading && <Spinner animation="border"/>}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <div className="row" style={{width: "95%", marginLeft: '5%'}}>

                {!loading && myOrderedBacks && myOrderedBacks.length > 0 ? (
                    myOrderedBacks.map((sb, index) => (
                        <div key={index} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                            <Card>
                                <Card.Body>
                                    <ul>
                                        <li><p><strong> Name: </strong> {sb._nameSB}</p></li>
                                        <li><p><strong> Description:</strong> {sb._description}</p></li>
                                        <li><p><strong> Product:</strong> {sb._product}</p></li>
                                        <li><p><strong> Ordered by Client:</strong> {sb._loginClient}</p></li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </div>
                    ))
                ) : !loading && (
                    <p></p>
                )}
            </div>
        </Container>
);
};

export default InfMyOrdersSB;