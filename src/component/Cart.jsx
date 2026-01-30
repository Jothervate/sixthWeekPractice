const Cart =({carts,removeTargetItem,clearCart,updateQty,cartItemTotal,isGetCarts})=>{
    
    return (<>
        <div className="col-md-12">
            <div className="d-flex justify-content-end mb-3">
                <div className="d-flex gap-2">
                
                    <button type="button" className="btn btn-outline-primary">
                        結帳 <i className='bi bi-cart-check' />
                    </button>
                    
                    <button type="button" className="btn btn-outline-danger" onClick={()=>clearCart()}>
                        刪除全部 <i className="bi bi-trash"></i>
                    </button>
                    
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>產品名稱</th>
                        <th>售價</th>
                        <th>數量</th>
                        <th>小計</th>
                        <th>操作</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        carts && carts.length > 0 ?(
                            carts.map((item)=>
                            (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.price}</td>
                                    <td className="align-middle">
                                        {/* 使用 d-flex 讓內容水平排列，gap-3 剛好就是你想要的 m-3 距離 */}
                                        <div className="d-flex align-items-center justify-content-center gap-3">
                                            
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-secondary border-0 px-1"
                                                onClick={() => updateQty(item.id,"minus")}
                                            >
                                                <i className="bi bi-dash-lg" style={{ fontSize: "0.8rem" }} />
                                            </button>

                                            <span className="fw-bold">{item.qty}</span>

                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-primary border-0 px-1"
                                                onClick={() => updateQty(item.id,"add")}
                                            >
                                                <i className="bi bi-plus-lg" style={{ fontSize: "0.8rem" }} />
                                            </button>
                                            
                                        </div>
                                    </td>
                                    <td>{item.total}</td>
                                    <td>
                                        <button type="button" className="btn btn-danger" onClick={()=>removeTargetItem(item)}>
                                            移除該產品 <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ):(
                            isGetCarts?(
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        尚無無產品資料!
                                    </td>
                                </tr>
                            ):(
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        載入產品失敗!
                                    </td>
                                </tr>
                            )
                            
                        )   
                    }
                </tbody>

                <tfoot>
                    <tr>
                        <td colSpan="3" className="text-end fw-bold">
                            總計
                        </td>
                        <td className="text-end fw-bold text-danger">
                            NT {cartItemTotal}
                        </td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </>)
}

export default Cart;