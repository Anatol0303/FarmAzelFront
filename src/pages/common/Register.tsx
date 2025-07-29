import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { Navigate, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/slices/authSlice';

const Register = () => {
    const role = useSelector((state: RootState) => state.role.role);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        login: '',
        password: '',
        firstName: '',
        lastName: '',
        address:'',
        phone:0,
        mail:'',
        postCode:0,
    });

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!role) return <Navigate to="/" />;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        const url = role === 'farmer'
            ? 'http://localhost:8080/apifarm/registerFarmer'
            : 'http://localhost:8080/apifarm/registerClient';

        const { login, password, firstName, lastName, address, phone,mail, postCode } = formData;
        const payload =
            role === 'farmer'
                ? { login, password, firstName, lastName, address, phone, mail, postCode }
                : { login, password, firstName, lastName, address, phone, mail, postCode };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

             const data = await response.json();

            if (!response.ok) {

                throw new Error(data.message || 'Unknown error');
            }

            if (!data.token) {
                console.log('4')
                throw new Error('Farmer with this login already exists');
            }

            dispatch(setToken(data.token)); // <-- Сохраняем токен в store
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', role);
            setMessage('Login was successful!');
            navigate(role === 'farmer' ? '/dashboardfarmer' : '/dashboardclient');


        } catch (err) {
            console.log('err')
            setError((err as Error).message);
        }
    };

    return (

        <Container fluid className="mt-5" style={{ maxWidth: '100%' }}>

            <h2>Registration for {role}</h2>
            <Form onSubmit={handleSubmit}>

                <Form.Group as={Row} className="mb-3">
                    <Col md={6}>
                        <Form.Label>Login</Form.Label>
                        <Form.Control
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            required
                        />
                    </Col>

                    <Col md={6}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Col md={6}>
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required />
                    </Col>

                    <Col md={6}>
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Col md={6}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="mail"
                            value={formData.mail}
                            onChange={handleChange}
                            required />
                    </Col>

                    <Col md={6}>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type = "number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required />
                    </Col>
                </Form.Group>

                {(role === 'farmer' || role === 'client') && (
                    <Form.Group as={Row} className="mb-3">
                        <Col md={6}>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required />
                        </Col>

                        <Col md={6}>
                            <Form.Label>Post code</Form.Label>
                            <Form.Control
                                type = "number"
                                name="postCode"
                                value={formData.postCode}
                                onChange={handleChange}
                                required />
                        </Col>
                    </Form.Group>
                )}

                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}

                <Button type="submit" variant="primary">Register</Button>

            </Form>

        </Container>

    );
};

export default Register;