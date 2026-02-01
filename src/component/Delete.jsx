import { forwardRef } from 'react';

const DeleteModal = forwardRef(({ templateProduct, updateProductData, closeModal ,isDeleteItem}, ref) => {
    return (
        <div
        id="delProductModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="delProductModalLabel"
        aria-hidden="true"
        ref={ref}
        >
        <div className="modal-dialog modal-xl">
            <div className='modal-content border-0'>
            <div className='modal-header bg-danger text-white'>
                <h5 className="modal-title" id="delProductModalLabel">刪除產品</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <div className='modal-body'>
                <h1 className="text-danger">此為刪除功能，一旦刪除，無法回溯！</h1>
                <h3 className='text-secondary'>
                確認是否刪除產品：<span className="text-dark">{templateProduct?.title}</span>?
                </h3>
            </div>
            <fieldset disabled={isDeleteItem}>
                <div className='d-flex justify-content-center align-items-center mb-5 gap-5'>
                    <button type='button' className='btn btn-danger px-4' onClick={updateProductData}>刪除</button>
                    <button type='button' className='btn btn-secondary px-4' onClick={closeModal}>取消</button>
                </div>
            </fieldset>
            </div>
        </div>
        </div>
    );
});

export default DeleteModal;