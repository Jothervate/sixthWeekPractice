// Details.jsx
const Details = ({ item, onClose }) => {
    if (!item) return null;

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                {/* 標題區域：使用 Flex 佈局簡化對齊 */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">產品細節</h2>
                {/* 使用 Bootstrap 內建的 btn-close 更精簡 */}
                <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={onClose} 
                    aria-label="Close"
                > 回上一頁</button>

                </div>

                <img src={item.imageUrl} className="img-fluid rounded mb-3" alt={item.title} />
                
                <h5 className="d-flex align-items-center">
                {item.title}
                <span className="badge bg-primary ms-2">{item.category}</span>
                </h5>

                <p className="text-muted">商品內容：{item.content}</p>

                <div className="h5">
                價格：
                <del className="text-secondary small me-2">{item.origin_price}</del>
                <span className="text-danger">{item.price} 元</span>
                </div>

                {/* 更多圖片區塊 */}
                {item.imagesUrl?.some(url => url.trim() !== "") && (
                <div className="mt-4">
                    <h6>更多圖片：</h6>
                    <div className="row g-2">
                    {item.imagesUrl.map((url, index) => (
                        url.trim() !== "" && (
                        <div key={index} className="col-4">
                            <img 
                            src={url} 
                            alt={`細節圖-${index}`} 
                            className="img-fluid rounded object-fit-cover"
                            style={{ height: "80px", width: "100%" }}
                            />
                        </div>
                        )
                    ))}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default Details;