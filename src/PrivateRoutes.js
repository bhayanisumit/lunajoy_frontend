import { Navigate, Outlet } from 'react-router-dom'



const PrivateRoutes = () => {
    let auth =   localStorage.getItem("auth");
    console.log('cookie' ,  auth)
return (
    auth === undefined || auth === null  ? <Navigate to='/' />  :  <Outlet/> 
  )
}
export default PrivateRoutes;