import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Container, Row, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/slices/authSlice';

const Login = () => {
    const role = useSelector((state: RootState) => state.role.role);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        login: '',
        password: ''
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
            ? `${baseURL}/apifarm/loginFarmer`
            : `${baseURL}/apifarm/loginClient`;

        const { login, password } = formData;

        const payload = { login, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            //console.log(data.message );
            if (!response.ok) {
                throw new Error(data.message || 'Unknown error');
            }

            if (!data.token) {
                throw new Error(data.message);
            }

            dispatch(setToken(data.token)); // <-- Сохраняем токен в store
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', role);
            setMessage('Login was successful!');
            navigate(role === 'farmer' ? '/dashboardfarmer' : '/dashboardclient');

        } catch (err) {

            setError((err as Error).message);
            //setError(data.message);
        }
    };

    return (

        <Container fluid className="mt-5" style={{ maxWidth: '100%' }}>

            <h2>Login for {role}</h2>
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

                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}

                <Button type="submit" variant="primary">Login</Button>

            </Form>

        </Container>

    );

};

export default Login;