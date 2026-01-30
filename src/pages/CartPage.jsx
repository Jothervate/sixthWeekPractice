import Cart from "../component/Cart";

const CartPage=({checkLogin,carts,removeTargetItem,clearCart,updateQty,cartItemTotal,isGetCart})=>{
    return (
        <>
            <h1 className="text-dark text-center">
                購物車
            </h1>

            <div className="container mt-5">
                <div className="row">
                    <Cart 
                        checkLogin={checkLogin}
                        carts={carts}
                        removeTargetItem={removeTargetItem}
                        clearCart={clearCart}
                        updateQty={updateQty}
                        cartItemTotal={cartItemTotal}
                        isGetCart={isGetCart}/>
                </div>
            </div>
        </>
    )
}

export default CartPage;