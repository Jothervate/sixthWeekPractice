import axios from "axios";
// 建議將常數統一管理
import { API_BASE } from "../Constants/config";
import {  useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";


const Not_logging = ({ setIsAuth }) => {
    // 💡 記得要把 errors 拿出來用
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onLogin = async (data) => {
        try {
            const payLoad={
                username:data.username,
                password:data.password
            }
            // 這裡的 data 會是 { username: "...", password: "..." }
            const res = await axios.post(`${API_BASE}/admin/signin`, payLoad);
            const { token, expired, message } = res.data;

            // 2. 防呆：確保 token 真的存在才執行後續動作
            // 如果後端沒給 token，這裡就不該繼續執行 document.cookie
            if (!token) {
                throw new Error("登入失敗：未取得 Token");
            };

            // 3. 寫入 Cookie (記得時間要轉毫秒)
            // 假設 expired 是秒數 (Unix Timestamp)
            const expirationDate = new Date(expired * 1000); 
            document.cookie = `hexToken=${token}; expires=${expirationDate.toUTCString()}; path=/`;

            // 4. 設定 axios
            axios.defaults.headers.common['Authorization'] = token; // 或 `Bearer ${token}`

            alert(message);
            setIsAuth(true);
            navigate('/');
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || "發生錯誤，請重新登入！";
            alert(errorMessage);
            setIsAuth(false);
        }
    };

    return (
        <div className="container login"> 
            <h3 className="mt-5 text-secondary">"Demo Project only. Do NOT enter real credentials."</h3>
            <h3 className="mt-5 text-secondary">（僅供練習，請勿輸入真實帳號密碼。）</h3>
            <h1 className="mt-5">請先登入</h1>
            <form className="form-floating form-signin" onSubmit={handleSubmit(onLogin)}>
                <div className="mb-3">
                    <label htmlFor="Email1" className="form-label">電子信箱</label>
                    <input 
                        type="email"
                        placeholder="Email" 
                        // 💡 1. 名稱改為 'username' (API 要求)
                        // 💡 2. 樣式改為 is-invalid (錯誤時顯示)
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        id="Email1" 
                        {...register('username', {
                            required: 'Email 為必填',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
                                message: "Email 格式不正確"
                            }
                        })}
                    />
                    {/* 💡 3. 這裡要對應 errors.username */}
                    {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="Password" className="form-label">密碼</label>
                    <input 
                        type="password"
                        placeholder="password" 
                        // 💡 4. 樣式改為 is-invalid
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="Password" 
                        {...register('password', {
                            required: "密碼為必填!",
                            minLength: { value: 6, message: '長度不得低於六個字!' },
                            maxLength: { value: 12, message: '長度不得超過十二個字!' }
                        })}
                    />
                    {errors.password && <div className='invalid-feedback'>{errors.password.message}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-2">提交</button>
            </form>
        </div> 
    );
}

export default Not_logging;