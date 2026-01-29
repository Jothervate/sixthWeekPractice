import { useState, useRef, useEffect ,useCallback} from 'react';
import { Route,Routes,Link ,useNavigate} from 'react-router-dom';
import axios from "axios";
import * as bootstrap from "bootstrap";

import { NEW_PRODUCT_DATA,API_BASE,API_PATH } from './Constants/config';

import Not_logging from './component/Not_logging';
import ProductEdit from './pages/ProductEdit';
import ProductModal from './component/ProductModal';
import DeleteModal from './component/Delete';



// 分頁頁面
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import DetailPage from './pages/DetailPage';
import ProductPage from './pages/ProductPage';
import Error from './pages/Error';




function App() {

  // 初始化navigate設定
  const navigate= useNavigate();
  // 初始化是否以cookies首次跳轉
  const hasInitialRedirected= useRef(false);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isAuth, setIsAuth] = useState(false);
  // 新增載入狀態,避免頁面沒有進行更新
  const [isLoading,setIsLoading] =useState(false);

  // 分流：定義兩個不同的資料庫
  const [adminProducts, setAdminProducts] = useState([]);  // 後端(產品編輯)管理用
  const [clientProducts, setClientProducts] = useState([]); // 前台(產品列表)列表用

  const [templateData,setTemplateData]=useState(null);
  // 建立購物車資訊
  const [carts,setCarts]= useState([]);

  // 設置初始表單內容
  const [templateProduct,setTemplateProduct]= useState(NEW_PRODUCT_DATA); 
  // 設置功能系統
  const [modalType,setModalType]= useState('');
  
  // 取得頁面資訊
  const [adminPagination,setAdminPagination] = useState({});
  const [clientPagination,setClientPagination]= useState({});
  
  // 是否上傳中
  const [isUploading,setIsUploading]= useState(false);

  // 1. 初始化兩個不同的 Ref
  const productModalRef = useRef(null);
  const delProductModalRef = useRef(null);

  // 2. 在 useEffect 中分別實例化 Bootstrap Modal
  const modalInstance = useRef(null);
  const delModalInstance = useRef(null);

  useEffect(() => {
    modalInstance.current = new bootstrap.Modal(productModalRef.current);
    delModalInstance.current = new bootstrap.Modal(delProductModalRef.current);
  }, []);

  // 3. 修改 openModal：根據 type 開啟對應的實例
  const openModal = (type, product) => {
    setModalType(type);
    setTemplateProduct({
      ...NEW_PRODUCT_DATA,
      ...product,
      imagesUrl: product?.imagesUrl ? [...product.imagesUrl] : [""]
    });

    if (type === 'delete') {
      delModalInstance.current.show();
    } else {
      modalInstance.current.show();
    }
  };

  // 4. 修改 closeModal：關閉所有可能的視窗
  const closeModal = () => {
    modalInstance.current.hide();
    delModalInstance.current.hide();
  };

  // 取得 Cookie 的輔助函式（搬到父元件，方便全域使用）
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // 取得產品資料
  //多新增isAdmin-->為之後只想純取啟用產品做準備
  // 取得資料函式（優化參數處理）
  const getDatas = useCallback(async (page=1, isAdmin=true) => {
    // 讀取資料為true
    setIsLoading(true);

    // 💡 依據模式清空對應的資料，避免「閃過舊資料」
    if (isAdmin) setAdminProducts([]);
    else setClientProducts([]);
    
    try {
      // 注意：這裡補上了 ${API_PATH} 後面的斜線 /
      const path= isAdmin?`admin/products` : `products`;
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/${path}?page=${page}`);
      if(isAdmin){
        setAdminProducts(res.data.products);
        setAdminPagination(res.data.pagination);
      }else{
        setClientProducts(res.data.products);
        setClientPagination(res.data.pagination);
      }
      

    } catch (err) {
      alert(`取得產品失敗: ${err.response?.data?.message || err.message}`);
    }finally{
      // 無論成功與否,最後讀取功能都會變回false
      setIsLoading(false);
    }
  },[]);

  // 檢查登入狀態 (搬回父元件)
  useEffect(() => {
    const token = getCookie("hexToken");

    if (!token) {
        setIsAuth(false);
        return;
      };

      axios.defaults.headers.common['Authorization'] = token;
      const checkAuth = async () => {
        try {
          await axios.post(`${API_BASE}/api/user/check`);
          setIsAuth(true);
          getDatas(); // 驗證成功，直接抓資料

          // 只有當「尚未執行過初始跳轉」時，才執行 navigate('/')
          if (hasInitialRedirected.current === false) {
            navigate('/');
            // 跳轉後，立刻將開關設為 true，之後這個 useEffect 就算再執行也不會觸發跳轉
            hasInitialRedirected.current = true;
          };
        } catch (err) {
          console.error("驗證失敗", err);
          setIsAuth(false);
        }
      };
      checkAuth();
  }, [getDatas,navigate]); // 僅在頁面載入時執行


  

  // 手動按鈕檢查 (你原本的按鈕功能)
  const checkLogin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      alert(`你已成功登入！讚讚！`);
    } catch (err) {
      alert(`驗證無效: ${err.response?.data?.message}`);
    }
  };

  // 查看詳細資訊
  const getTemplateData = (item) => {
    // 1. 檢查陣列是否已有資料，且 ID 是否跟點擊的產品一樣
    const isAlreadyLoaded = templateData?.length > 0 && templateData[0].id === item.id;

    if (isAlreadyLoaded) {
      alert('你已獲取該產品細節，無須再獲取！');
      return; // 中止執行
    }

    try {
      // 2. 將 templateData 替換為只包含「當前點擊產品」的陣列
      setTemplateData([item]); 
      // alert("取得詳細資訊成功!");
    } catch (err) {
      alert(`發生錯誤: ${err.message}`);
    }
  };

  // 處理輸入設定(關鍵)
  const handleModalInputChange=(e)=>{
    const {name,value,checked,type}= e.target;
    setTemplateProduct((pre)=>({
      ...pre,
      [name]: type==="checkbox"?checked:value
    }));

  };
  // 修改副圖片
  const handleModalImageChange=(index,value)=>{

    setTemplateProduct((pre)=>{
      const newImages= [...(pre.imagesUrl|| []) ];

      // 更新索引值的value
      newImages[index]= value;

      // 每當多一格空字串-->新增空白輸入框-->超過五個-->則終止
      if(newImages[value]!=="" && index ===newImages.length-1 && newImages.length<5){
        newImages.push("");
      };

      // 如果最後一格是空的，且倒數第二格也是空的 (代表有多餘的空白格)，則移除最後一格
      // 這樣可以確保「輸入框列表」的末端最多只有一個空白格供使用者繼續輸入
      if(newImages.length >1 && 
        newImages[newImages.length-1]==="" &&
        newImages[newImages.length-2]===""){
        newImages.pop();
      };

      return {
        ...pre,
        imagesUrl:newImages
      };
    })
  };

  //加入多層圖片
  const addNewImages =()=>{
      setTemplateProduct((pre)=>{
        const currentImages = pre.imagesUrl || [];
        if(currentImages.length<5){
          return {
            ...pre,
            imagesUrl: [...currentImages, ""] // 這裡直接解構並新增，更簡潔
          };
        }else{
          alert(`你已超過加入圖片上限!`)
          return pre
        }
      });
  };


  //移除多層圖片
  const removeImages= ()=>{
    setTemplateProduct((pre)=>{
      const currentImages = pre.imagesUrl || [];
      if(currentImages.length>1){
        const newImages= [...currentImages]
        newImages.pop();
        return {
          ...pre,
          imagesUrl:newImages
        }
      }else{
        alert(`至少要有一張圖片!`)
        return pre;
      }
      
    })
  }

  // 根據不同功能來進行不同執行動作
  const updateProductData= async()=>{

    // 解構id
    const { id } = templateProduct;
    // 新增端點+方法
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";
    let status = "";
    let payload = null; // 用來存放要送出的資料

    // 1. 根據類型決定參數
    // 使用switch方法
      switch (modalType) {
        case "create":
          status = "新增";
          method = "post";
          break;

        case "edit":
          if (!id) return alert("產品 id 缺失，無法更新");
          status = "更新";
          method = "put";
          url = `${url}/${id}`;
          break;

        case "delete":
          if (!id) return alert("產品 id 缺失，無法刪除");
          status = "刪除";
          method = "delete";
          url = `${url}/${id}`;
          break;

        default:
          return;
      }

      // 2. 處理資料格式 (只有新增和更新需要 body)
      if (method !== "delete") {
        payload = {
          data: {
            ...templateProduct,
            origin_price: Number(templateProduct.origin_price) || 0,
            price: Number(templateProduct.price) || 0,
            is_enabled: templateProduct.is_enabled ? 1 : 0,
            imagesUrl: (templateProduct.imagesUrl || []).filter((link) => link.trim() !== ""),
          },
        };
      }

      // 3. 執行請求
      try {
        // 注意：delete 的呼叫方式與其他不同
        method === "delete" 
          ? await axios.delete(url) 
          : await axios[method](url, payload);

        alert(`${status}資料成功!`);
        await getDatas();
        closeModal();
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        console.error(`${status}失敗：`, errorMsg);
        alert(`${status}失敗：${errorMsg}`);
      }
    };

    // 處理上傳圖片

    const uploadImage=async(e)=>{
        const file= e.target.files?.[0];//目前只需要取一張圖片就好
        if(!file){
            alert('請上傳一張圖片!');
            return;
        }

        // 前端初步驗證
        // 圖片大小不可超過2MB
        const maxSize= 2*1024*1024;
        if(file.size>maxSize){
          alert('圖片大小不可超過2MB!');
          e.target.value='';//清空input
          return ;
        };

        setIsUploading(true);

        try{
            const formData= new FormData();
            formData.append("file-to-upload",file);
            const res= await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`,formData);
            const uploadImageUrl= res.data.imageUrl;
            setTemplateProduct((pre)=>({
                ...pre,
                imageUrl:uploadImageUrl
            }))

        }catch(err){
            const errorMsg= err.response?.data?.message||'上傳失敗!';
            alert(`錯誤: ${errorMsg}`);
            console.log(err)
        }finally{
          setIsUploading(false);//成功或失敗都結束上傳狀態
          e.target.value=''//清空input值
        }
    };

    // 處理購物車資訊
    const addToCart = (product) => {
      setCarts((prevCart) => {
        // 1. 使用可選連綴 (?.) 預防 prevCart 裡有 undefined 的情況
        const isItemInCart = prevCart.find((item) => item?.id === product.id);

        if (isItemInCart) {
          return prevCart.map((item) => {
            if (item.id === product.id) {
              // 先算出新的數量
              const newQty = item.qty + 1; 
              return {
                ...item,
                qty: newQty,
                // 這裡要用 item.price (或 product.price) 乘以「新數量」
                total: Number(item.price) * newQty 
              };
            }
            return item;
          });
        }

        // 2. 新產品：第一次加入時，total 就是單價
        return [...prevCart, { ...product, qty: 1, total: Number(product.price) }];
      });
    };

    // 移除購物車指定項目內容
    const removeTargetItem=(product)=>{
      if(window.confirm("確定要移除該品項出去嗎?")){
        setCarts((prevCart)=>prevCart.filter((item)=>item.id!==product.id));
      }
    };

    // 全部清除
    const clearCart=()=>{
      if(carts.length>0){
        if(window.confirm("要全部清空嗎?")){
          setCarts([]);
        }
      }else{
        alert("購物車早就沒東西,無須清空!")
      }
      
    };

    //更新數量狀態
    const updateQty = (productId, type) => {
      setCarts((prevCart) => {
        return prevCart.map((item) => {
          if (item.id === productId) {
            const newQty = type === "add" ? item.qty + 1 : item.qty - 1;
            // 確保最少為 1
            const finalQty = newQty < 1 ? 1 : newQty;
            
            return {
              ...item,
              qty: finalQty,
              total: Number(item.price) * finalQty
            };
          }
          return item; // 沒對到的項目要原樣回傳，不然會變 undefined
        });
      });
    };

    // 購物車內容全部進行加總
    const cartItemTotal =carts.reduce((acc,item)=>acc +(item.total||0),0);

return (
  <>
      {!isAuth ? (
        <Not_logging
          formData={formData}
          setFormData={setFormData}
          setIsAuth={setIsAuth}
          getDatas={getDatas}
        />
      ) : (

        <>
          <div>
            <nav className='d-flex align-item-center justify-content-center  gap-3' style={{padding:"20px"}}>
              <Link to='/' className='pe-3 border-end'>首頁</Link>
              <Link to='/products'  className='pe-3 border-end'>產品列表</Link>
              <Link to='/productEdit' className='pe-3 border-end'>產品編輯</Link>
              <Link to='/cart'  className='pe-3 border-end'>購物車</Link>
              
            </nav>
            <hr />
            <Routes>
              <Route
                path='/'
                element={<Home 
                  checkLogin={checkLogin}/>}/>
              
              <Route 
                path='/products'
                element={<ProductPage 
                    isLoading={isLoading}
                    products={clientProducts}             // 傳遞產品列表資料
                    pagination={clientPagination}         // 傳遞分頁資料
                    getDatas={(page)=>getDatas(page,false)}             // 傳遞取得資料的函式
                    openModal={openModal}           // 傳遞開啟 Modal 的函式
                    getTemplateData={getTemplateData} // 傳遞取得細節的函式
                    templateData={templateData}     // 傳遞目前選中的細節資料
                    setTemplateData={setTemplateData} // 傳遞更新細節資料的函式
                    checkLogin={checkLogin}         // 傳遞檢查登入的函式
                    addToCart={addToCart}
                  />}/>
              {/* 👇 加入這一行，注意路徑要跟你的 Link 一致 */}
              <Route path='/product/:id' element={<DetailPage />} />
              <Route 
                path='/productEdit' 
                element={<ProductEdit
                  isLoading={isLoading}
                  openModal={openModal}
                  checkLogin={checkLogin}
                  products={adminProducts}
                  pagination={adminPagination}
                  getDatas={(page)=>getDatas(page,true)}/>} />
              <Route 
                path='/cart'
                element={<CartPage 
                  checkLogin={checkLogin}
                  carts={carts}
                  removeTargetItem={removeTargetItem}
                  clearCart={clearCart}
                  updateQty={updateQty}
                  cartItemTotal={cartItemTotal}/>}/>

            </Routes>
          </div>
          
        </>
      )}

      {/* {Modal} */}
      <ProductModal 
        ref={productModalRef}
        modalType={modalType}
        templateProduct={templateProduct}
        handleModalInputChange={handleModalInputChange}
        handleModalImageChange={handleModalImageChange}
        addNewImages={addNewImages}
        removeImages={removeImages}
        updateProductData={updateProductData}
        closeModal={closeModal}
        uploadImage={uploadImage}
        isUploading={isUploading}
      />

      <DeleteModal 
        ref={delProductModalRef}
        templateProduct={templateProduct}
        updateProductData={updateProductData}
        closeModal={closeModal}
      />
      {/* {Modal end} */}
    </>
  );
}

export default App;