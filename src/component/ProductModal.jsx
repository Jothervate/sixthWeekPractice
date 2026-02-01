import { forwardRef } from 'react';

const ProductModal = forwardRef(({ 
    modalType, 
    templateProduct, 
    handleModalInputChange, 
    handleModalImageChange, 
    addNewImages, 
    removeImages, 
    updateProductData, 
    closeModal ,
    uploadImage,
    isUploading
    }, ref) => {

    

    return (
        <div
        id="productModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
        ref={ref}
        >
            <div className="modal-dialog modal-xl">

                <div className="modal-content border-0">

                    <div className={`modal-header ${modalType === "edit" ? "bg-black" : "bg-primary"} text-white`}>
                        <h5 id="productModalLabel" className="modal-title">
                        <span>{modalType === "edit" ? "編輯" : "新增"}產品</span>
                        </h5>
                        <button type="button" className="btn-close" onClick={closeModal}></button>
                    </div>

                    <div className="modal-body">
                        <div className="row">
                        {/* 左側圖片區 */}
                        <div className="col-sm-4">
                            <fieldset disabled={isUploading}>
                                <div className="mb-3">
                                    <label htmlFor="fileUpload">
                                        上傳圖片
                                    </label>
                                    <input 
                                        type="file"
                                        id="fileUpload"
                                        name="fileUpload"
                                        className={`form-control ${isUploading?"bg-light":""}`} 
                                        accept='.jpg,.png,.jpeg'
                                        onChange={(e)=>uploadImage(e)}/>
                                    {isUploading && <p className='text-muted small mt-1'>檔案上傳中,請稍後...</p>}
                                </div>
                                <div className="mb-3">
                                <label htmlFor="imageUrl" className="form-label">輸入圖片網址</label>
                                <input
                                    type="text" id="imageUrl" name="imageUrl" className="form-control"
                                    placeholder="請輸入圖片連結" value={templateProduct?.imageUrl}
                                    onChange={handleModalInputChange}
                                />
                                </div>
                            </fieldset>
                            
                            <img className="img-fluid" src={templateProduct?.imageUrl || null} alt="主圖" />
                            <hr />
                            <div className="row row-cols-2 g-4">
                            {(templateProduct?.imagesUrl || [""]).map((url, index) => (
                                <div className="col" key={index}>
                                <div className='border p-2 rounded'>
                                    <input
                                    type="text" className="form-control mb-2" value={url}
                                    placeholder='副圖網址' onChange={(e) => handleModalImageChange(index, e.target.value)}
                                    />
                                    <img src={url} className="img-fluid" style={{ height: "100px", objectFit: "cover" }} alt="" />
                                </div>
                                </div>
                            ))}
                            </div>
                            <div className="d-flex gap-2 mt-3">
                            <button type='button' className="btn btn-outline-primary btn-sm w-50" onClick={addNewImages}>新增圖片</button>
                            <button type='button' className="btn btn-outline-danger btn-sm w-50" onClick={removeImages}>刪除圖片</button>
                            </div>
                        </div>
                        
                        {/* 右側文字區 (標題、分類、原價、售價等...) */}
                        <div className="col-sm-8">
                            <div className="mb-3">
                            <label htmlFor="title" className="form-label">標題</label>
                            <input name="title" id="title" type="text" className="form-control" value={templateProduct.title} onChange={handleModalInputChange} />
                            </div>
                            <div className="row">
                            <div className="mb-3 col-md-6">
                                <label htmlFor="category" className="form-label">分類</label>
                                <input name="category" id="category" className="form-control" value={templateProduct.category} onChange={handleModalInputChange} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="unit" className="form-label">單位</label>
                                <input name="unit" id="unit" className="form-control" value={templateProduct.unit} onChange={handleModalInputChange} />
                            </div>
                            </div>
                            <div className="row">
                            <div className="mb-3 col-md-6">
                                <label htmlFor="origin_price" className="form-label">原價</label>
                                <input name="origin_price" type="number" className="form-control" value={templateProduct.origin_price} onChange={handleModalInputChange} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="price" className="form-label">售價</label>
                                <input name="price" type="number" className="form-control" value={templateProduct.price} onChange={handleModalInputChange} />
                            </div>
                            </div>
                            <hr />
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">產品描述</label>
                                <textarea name="description" className="form-control" value={templateProduct.description} onChange={handleModalInputChange}></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">說明內容</label>
                                <textarea name="content" className="form-control" value={templateProduct.content} onChange={handleModalInputChange}></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">評分</label>
                                <div className="btn-group w-100" role="group">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        name="Rank"
                                        value={num}
                                        className={`btn btn-outline-success ${templateProduct.Rank === num ? 'active' : ''}`}
                                        onClick={handleModalInputChange}
                                    >
                                        {num} 星
                                        {
                                            num === 5 ?<i className="ms-1 bi bi-star-fill" style={{ color: "#ffc107" }}></i>:
                                            num ===1 && <i className="ms-1 bi bi-star-fill" style={{color:"lightgray"}}></i>
                                        }
                                    </button>
                                    ))}
                                </div>
                            </div>
                            <br />
                            <div className="form-check form-switch">
                                <input name="is_enabled" id="is_enabled" className="form-check-input" type="checkbox" 
                                    checked={templateProduct?.is_enabled} onChange={handleModalInputChange} />
                                <label className="form-check-label fw-bold" htmlFor="is_enabled">是否啟用</label>
                            </div>
                        </div>
                        </div>
                    </div>
                    <fieldset disabled={isUploading}>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>取消</button>
                            <button type='button' className="btn btn-primary" onClick={updateProductData}>確認</button>
                        </div>
                    </fieldset>
                    

                </div>
                
            </div>

        </div>
    );
});

export default ProductModal;