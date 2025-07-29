import { Routes, Route } from 'react-router-dom';
import RoleSelector from '../pages/common/RoleSelector';
import Login from '../pages/common/Login';
import Register from '../pages/common/Register';
import Enter from '../pages/common/Enter';
import EditClient from "../pages/clients/DashboardClient.tsx";
import EditFarmer from "../pages/farmers/DashboardFarmer.tsx";
import DeleteFarmer from "../pages/farmers/removeFarmer.tsx";
import UpdateFarmer from "../pages/farmers/updateFarmer.tsx";
import AddSurprizeBack from "../pages/farmers/addSurprizeBack.tsx";
import RemoveSurprizeBack from "../pages/farmers/deleteSurprizeBack.tsx";
import UpdateSurprizeBack from "../pages/farmers/updateSB.tsx";
import UpdateFarmerPassword from "../pages/farmers/updateFarmerPassword.tsx";
import InfMyOrdersSB from "../pages/farmers/InfMyOrdersSB.tsx";
import InfSBByNameSB from "../pages/farmers/infSBByNameSB.tsx";
import InfFarmerByLogin from "../pages/common/infFarmerByLogin.tsx";
import InfAllFarmers from "../pages/common/infAllFarmers.tsx";
import DeleteClient from "../pages/clients/deleteClient.tsx";
import UpdateClient from "../pages/clients/updateClient.tsx";
import InfSurprizeBacksByProduct from "../pages/clients/InfSurprizeBacksByProduct.tsx";
import СreateOrderSurprizeBack from "../pages/clients/createOrderSB.tsx";
import RemoveOrderSurprizeBack from "../pages/clients/removeOrderSB.tsx";
import InfSurprizeBacksByFarmer from "../pages/common/infSurprizeBacksByFarmer.tsx";
import InfAllProducts from "../pages/common/infAllProducts.tsx";
import InfFarmersByProduct from "../pages/common/infFarmersByProduct.tsx";
import InfMyOrderedSurprizeBacks from "../pages/clients/infMyOrderedSurprizeBacks.tsx";
import UpdateClientPassword from "../pages/clients/updateClientPassword.tsx";
import InfClientByLogin from "../pages/farmers/infClientByLogin.tsx";

const AppRoutes = () => {

        return (
            <Routes>
                    <Route path="/" element={<RoleSelector/>} />
                    <Route path="/enter" element={<Enter/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/infAllFarmers" element={<InfAllFarmers/>}/>
                    {/*---------------------------------------------------------------*/}
                    <Route path="/dashboardfarmer" element={<EditFarmer/>}/>
                    <Route path="/updateFarmer" element={<UpdateFarmer/>}/>
                    <Route path="/removeFarmer" element={<DeleteFarmer/>}/>
                    <Route path="/updateFarmerPassword" element={<UpdateFarmerPassword/>}/>
                    <Route path="/addSurprizeBack" element={<AddSurprizeBack/>}/>
                    <Route path="/removeSurprizeBack" element={<RemoveSurprizeBack/>}/>
                    <Route path="/updateSurprizeBack" element={<UpdateSurprizeBack/>}/>
                    <Route path="/InfOrdersSB" element={<InfMyOrdersSB/>}/>
                    <Route path="/infSBByNameSB" element={<InfSBByNameSB/>}/>
                    <Route path="/infFarmerByLogin" element={<InfFarmerByLogin/>}/>
                    <Route path="/InfFarmersByProduct" element={<InfFarmersByProduct/>}/>
                    <Route path="/InfClientByLogin" element={<InfClientByLogin/>}/>

                    {/*---------------------------------------------------------------*/}
                    <Route path="/dashboardclient" element={<EditClient/>}/>
                    <Route path="/updateClient" element={<UpdateClient/>}/>
                    <Route path="/deleteClient" element={<DeleteClient/>}/>
                    <Route path="/InfSurprizeBacksByProduct" element={<InfSurprizeBacksByProduct/>}/>
                    <Route path="/createOrderSB" element={<СreateOrderSurprizeBack/>}/>
                    <Route path="/removeOrderSB" element={<RemoveOrderSurprizeBack/>}/>
                    <Route path="/InfSurprizeBacksByFarmer" element={<InfSurprizeBacksByFarmer/>}/>
                    <Route path="/InfAllProducts" element={<InfAllProducts/>}/>
                    <Route path="/InfMyOrderedSurprizeBacks" element={<InfMyOrderedSurprizeBacks/>}/>
                    <Route path="/updateClientPassword" element={<UpdateClientPassword/>}/>

            </Routes>
        );



};

export default AppRoutes;
