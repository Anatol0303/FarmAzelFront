import { useSelector} from 'react-redux';
import { type RootState } from '../../app/store';
import {Navigate, useNavigate} from 'react-router-dom';
//import {setRole} from "../../store/slices/roleSlice.ts";
// import Login from "./Login.tsx";
// import Register from "./Register.tsx";
import {Button, Container} from "react-bootstrap";
// import {Route} from "react-router-dom";

const Enter = () => {
    const role = useSelector((state: RootState) => state.role.role);
    const navigate = useNavigate();
    if (!role) return <Navigate to="/" />;

    //const dispatch = useDispatch();


    const handleSelectLogin = () => {
        navigate('/login');
    }
    const handleSelectRegister = () => {
        navigate('/register');
    }


        return (
            <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
                <h2 className="mb-4">Welcome, {role}</h2>
                <div className="d-flex gap-3">
                    <Button variant="success" size="lg" onClick={() => handleSelectLogin()}>Login</Button>
                    <Button variant="success" size="lg" onClick={() => handleSelectRegister()}>Register</Button>
                </div>
            </Container>
        );
    };


export default Enter;