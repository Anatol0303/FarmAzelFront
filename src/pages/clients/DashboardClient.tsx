import { Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import type {RootState} from "../../app/store.ts";
import {jwtDecode} from "jwt-decode";

type TokenPayload = {
    login: string;
    role: string;
};

const EditClient = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    //const loginFromToken = token ? (jwtDecode(token) as TokenPayload).login : null;
    const roleFromToken = token ? (jwtDecode(token) as TokenPayload).role : null;
    const navigate = useNavigate();

    const updateClient = () => {
        navigate('/updateClient');
    }

    const removeClient = () => {
        navigate('/deleteClient');
    }

    const InfSurprizeBacksByProduct = () => {
        navigate('/InfSurprizeBacksByProduct');
    };

    const createOrderSB = () => {
        navigate('/createOrderSB')
    };

    const removeOrderSB = () => {
        navigate('/removeOrderSB')
    };

    const InfSurprizeBacksByFarmer = () => {
        navigate('/InfSurprizeBacksByFarmer')
    };

    const InfAllProducts = () => {
        navigate('/InfAllProducts')
    };

    const infAllFarmers = () => {
        navigate('/infAllFarmers')
    };

    const InfFarmersByProduct = () => {
        navigate('/InfFarmersByProduct')
    };

    const InfFarmerByLogin = () => {
        navigate('/infFarmerByLogin')
    };

    const InfMyOrderedSurprizebacks = () => {
        navigate('/InfMyOrderedSurprizeBacks')
    };

    const updateClientPassword = () => {
        navigate('/updateClientPassword')
    };
    if (roleFromToken !== 'client') {
        return (
            <Container className="mt-4" style={{ maxWidth: '800px' }}>
                <Alert variant="danger">You are not registered as client. Operation is forbidden</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-5" style={{ maxWidth: '100%' }}>
    <h2>Choose an action</h2>
    <Form.Group as={Row} className="mb-3">
    <Col md={6}>
    <Button variant="success" size="lg" style={{ width: '100%', height: '80px'}} onClick={updateClient}>Edit your details</Button>
    </Col>

    <Col md={6}>
    <Button variant="success" size="lg" style={{ width: '100%', height: '80px' }} onClick={removeClient}>Close your account</Button>
    </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3">
        <Col md={6}>
            <Button variant="success" size="lg" style={{ width: '100%', height: '80px'}} onClick={updateClientPassword}>Update password</Button>
        </Col>
        <Col md={6}>
            <Button variant="success" size="lg" style={{ width: '100%', height: '80px'}} onClick={InfAllProducts}>
                Information of all products
            </Button>
        </Col>

    </Form.Group>
    <Form.Group as={Row} className="mb-3">
        <Col md={6}>
            <Button variant="success" size="lg" style={{ width: '100%', height: '80px'}} onClick={createOrderSB}>
                Create order to surprizeback
            </Button>
        </Col>
    <Col md={6}>
    <Button variant="success" size="lg" style={{ width: '100%', height: '80px'}} onClick={removeOrderSB}>Remove order to surprizeback</Button>
    </Col>
    </Form.Group>
    <Form.Group as={Row} className="mb-3">
        <Col md={6}>
            <Button variant="success" size="lg" style={{ width: '100%', height: '80px'}} onClick={InfMyOrderedSurprizebacks}>
                Information of my ordered surprizebacks
            </Button>
        </Col>
        <Col md={6}>
            <Button variant="success" size="lg" style={{ width: '100%', height: '80px'}} onClick={InfSurprizeBacksByFarmer}>
                Information of surprizebacks by farmer
            </Button>
        </Col>
    </Form.Group>
    <Form.Group as={Row} className="mb-3">
        <Col md={6}>
            <Button variant="success" size="lg" style={{ width: '100%', height: '80px'}} onClick={InfSurprizeBacksByProduct}>
                Information of surprizebacks by product
            </Button>
        </Col>

        <Col md={6}>
            <Button variant="success" size="lg" style={{ width: '100%', height: '80px'}} onClick={InfFarmersByProduct}>
                Information of farmers by product
            </Button>
        </Col>
    </Form.Group>
            <Form.Group as={Row} className="mb-3">
                <Col md={6}>
                    <Button variant="success" size="lg" style={{ width: '100%', height: '80px'}} onClick={infAllFarmers}>
                        Information of all farmers
                    </Button>
                </Col>
                <Col md={6}>
                    <Button variant="success" size="lg" style={{ width: '100%', height: '80px'}} onClick={InfFarmerByLogin}>Information of farmer by login</Button>
                </Col>
            </Form.Group>

        </Container>

);
};

export default EditClient;