const Pages =({handlePageChange,pagination})=>{

    // 預防性檢查--避免因為pagination尚未準備好而出現奇怪數字
    if(!pagination||!pagination.total_pages) return null;
    
    return (
        <>
            {/* {Pages start} */}
                    <div className='d-flex justify-content-center align-item-center'>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                            <li className={`page-item ${!pagination.has_pre && "disabled"}`}>
                                <a className={`page-link`} href="#" aria-label="Previous"
                                onClick={(e)=>handlePageChange(e,pagination.current_page-1)}>
                                <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>

                            {
                                Array.from({length:pagination.total_pages},(_,index)=>(
                                    <li className="page-item" key={`${index}_page`}>
                                        <a className={`page-link ${index + 1 === pagination.current_page && 'active'}`}
                                        href="#" onClick={(e)=>handlePageChange(e,index+1)}>
                                            {index+1}
                                        </a>
                                    </li>
                                ))
                            }
                            
                            <li className={`page-item ${!pagination.has_next && "disabled"}`}>
                                <a className="page-link" href="#" aria-label="Next"
                                onClick={(e)=>handlePageChange(e,pagination.current_page+1)}>
                                <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                            </ul>
                        </nav>
                        </div>
                {/* {Pages end} */}
        </>
    )
}

export default Pages ;