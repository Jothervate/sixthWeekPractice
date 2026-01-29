// ProductPage.jsx
import { useEffect } from "react";
import ProductList from "../component/ProductList"; // 假設路徑在此

const ProductPage = ({ getDatas, products, isLoading, ...props }) => {
    
    useEffect(() => {
        // 💡 當組件掛載（進入這頁）時，立刻發動「前台模式」抓取
        getDatas(1); 
    }, []); // 這裡的 getDatas 在 App.jsx 傳進來時已經綁定好 false 了

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">產品列表</h1>
            <div className="row">
                <ProductList 
                    products={products} 
                    isLoading={isLoading} 
                    onChangePages={getDatas} // 分頁切換也要走同一條路
                    {...props} 
                />
            </div>
        </div>
    );
}

export default ProductPage;