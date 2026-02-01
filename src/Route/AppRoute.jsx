// src/AppRoutes.jsx
import { Routes, Route ,Navigate} from 'react-router-dom';
import Home from '../pages/Home';
import ProductPage from '../pages/ProductPage';
import DetailPage from '../pages/DetailPage';
import ProductEdit from '../pages/ProductEdit';
import CartPage from '../pages/CartPage';
import Error from '../pages/Error';
import Not_logging from '../pages/Not_logging';

const AppRoute=({ 
  // 接收從 App.jsx 傳過來的狀態與方法
    isLoading,
    isAuth,
    setIsAuth,
    clientProducts,
    clientPagination,
    getDatas,
    openModal,
    getTemplateData,
    templateData,
    setTemplateData,
    checkLogin,
    addToCart,
    isLoadingSuccess,
    adminProducts,
    adminPagination,
    carts,
    removeTargetItem,
    clearCart,
    updateQty,
    cartItemTotal
}) => {
    return (
        <Routes>
            <Route
                path='/login'
                element={<Not_logging 
                    setIsAuth={setIsAuth}
                    />}
                />
            <Route  
                path='/404' element={<Error />}/>
            {
                isAuth?(
                    <>
                        <Route
                            path='/'
                            element={<Home checkLogin={checkLogin} />}
                        />
                        
                        <Route 
                            path='/products'
                            element={
                            <ProductPage 
                                isLoading={isLoading}
                                products={clientProducts}
                                pagination={clientPagination}
                                getDatas={(page) => getDatas(page, false)}
                                openModal={openModal}
                                getTemplateData={getTemplateData}
                                templateData={templateData}
                                setTemplateData={setTemplateData}
                                checkLogin={checkLogin}
                                addToCart={addToCart}
                                isGetProducts={isLoadingSuccess}
                            />
                            }
                        />

                        <Route path='/product/:id' element={<DetailPage />} />

                        <Route 
                            path='/productEdit' 
                            element={
                            <ProductEdit
                                isLoading={isLoading}
                                openModal={openModal}
                                checkLogin={checkLogin}
                                products={adminProducts}
                                pagination={adminPagination}
                                getDatas={(page) => getDatas(page, true)}
                                isGetDatas={isLoadingSuccess}
                            />
                            } 
                        />

                        <Route 
                            path='/cart'
                            element={
                            <CartPage 
                                checkLogin={checkLogin}
                                carts={carts}
                                removeTargetItem={removeTargetItem}
                                clearCart={clearCart}
                                updateQty={updateQty}
                                cartItemTotal={cartItemTotal}
                                isGetCarts={isLoadingSuccess}
                            />
                            }
                        />
                    </>
                ):(
                    <>
                        <Route
                            path='/'
                            element={<Navigate to="/login" replace/>}
                            />
                    </>
                )
            }            


            <Route 
                path ='*'
                element={
                    <Error/>
                }/>
        </Routes>
    );
}
export default AppRoute ;