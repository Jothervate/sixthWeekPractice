import { useEffect } from "react";
import Edit from "../component/Edit";



const ProductEdit=({getDatas,openModal,checkLogin,products,pagination,...props})=>{
    // 更新Data資料內容
    useEffect(()=>{
        getDatas(1);
    },[]);

    return (
        <>
            <h1 className="text-dark text-center mt-3">產品編輯</h1>

            <div className='container mt-5'>
                <div className='row'>
                    <Edit
                        openModal={openModal}
                        checkLogin={checkLogin}
                        products={products}
                        pagination={pagination}
                        onChangePages={getDatas}
                        {...props}
                    />
                </div>
            </div>
        </>
    )
}

export default ProductEdit;
