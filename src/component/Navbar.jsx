import { Link } from "react-router-dom";

const Navbar =()=>{
    return (
        <nav className='d-flex align-item-center justify-content-center  gap-3' style={{padding:"20px"}}>
            <Link to='/' className='pe-3 border-end'>首頁</Link>
            <Link to='/products'  className='pe-3 border-end'>產品列表</Link>
            <Link to='/productEdit' className='pe-3 border-end'>產品編輯</Link>
            <Link to='/cart'  className='pe-3 border-end'>購物車</Link>      
        </nav>
    )
};

export default Navbar;