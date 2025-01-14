import { useState } from "react"
import axios from "axios"
import './assets/style.css'

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example"
  })
  const [isAuth, setIsAuth] = useState(false)
  const [tempProduct, setTempProduct] = useState({});
  const [productList, setProductList] = useState([]);

  // 處理表單輸入變更的函式
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value
    }) 
  }

  // 處理登入請求的函式
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // 發送登入請求
    const loginRes = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
    const {token, expired} = loginRes.data;
    
    document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
    
    // 設定 token 到 cookie 和 axios 預設 headers
    axios.defaults.headers.common['Authorization'] = token;

    // 發送取得產品資料的請求
    const productsRes = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`);
    setProductList(productsRes.data.products);

    // 登入成功後更新認證狀態
    setIsAuth(true);
  } catch (error) {
    alert('登入失敗')
  }
}

// 檢查使用者是否已經登入的函式
const checkUserLogin = async () => {
  try {
    await axios.post(`${BASE_URL}/api/user/check`)
    alert('已經登入')
  } catch (error) {
    console.error(error)
    
  }
};


  return (
    <>
    {isAuth ? (<div className="container mt-3">
                  <button onClick={checkUserLogin} type="button" className="btn btn-success mb-5 btnWidth">檢查使用者是否登入</button>
                    <div className="row">
                        <div className="col-6">
                            <h2>產品列表</h2>
                            <table className="table">
  <thead>
    <tr>
      <th scope="col">產品名稱</th>
      <th scope="col">原價</th>
      <th scope="col">售價</th>
      <th scope="col">是否啟用</th>
      <th scope="col">查看細節</th>
    </tr>
  </thead>
  <tbody>
    {productList.map((product) => {
        return (<tr key={product.id}>
      <th scope="row">{product.title}</th>
      <td>{product.origin_price}</td>
      <td>{product.price}</td>
      <td>{product.is_enabled}</td>
      <td><button onClick={() => {setTempProduct(product)}} type="button" className="btn btn-primary">查看細節</button></td>
    </tr>)
    })}
  </tbody>
</table>
                        </div>
                        <div className="col-6">
                            <h2>單一產品細節</h2>    
                            {tempProduct.title ? (<div className="card">
                            <img src={tempProduct.imageUrl} className="card-img-top" alt="tempProduct.title" />
                            <div className="card-body">
                                <h5 className="card-title">{tempProduct.title} <span className="badge text-bg-primary">{tempProduct.category}</span></h5>
                                <p className="card-text">商品描述：{tempProduct.description}</p>
                                <p className="card-text">商品內容：{tempProduct.content}</p>
                                <p className="card-text"><del>{tempProduct.origin_price}</del>元 / {tempProduct.price}元</p>
                                <h5 className="card-title">更多圖片：</h5>  
                                {tempProduct.imagesUrl?.map((image, index) => {
                                    return (<img key={index} src={image} className="img-fluid" />)
                                })}                          
                            </div>
                            </div>) : (<p>請選擇一個商品查看</p>)}
                        </div>    
                    </div>
                </div>) : (<div className="container login">
      <div className="row">
        <h1>請先登入</h1>
        <div className="col-8 m0-auto mt-4">
          <form onSubmit={handleLogin} action="">
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label text-left">Email address</label>
            <input name="username"value={account.username} onChange={handleInputChange} type="email" className="m0-auto form-control inputText" id="exampleFormControlInput1" placeholder="name@example.com" />
          </div>
          <div className="mb-3">
            <label htmlFor="inputPassword5" className="form-label text-left">Password</label>
            <input name="password" value={account.password} onChange={handleInputChange} type="password" id="inputPassword5" className="m0-auto form-control inputText" aria-describedby="passwordHelpBlock" />
            <div id="passwordHelpBlock" className="form-text text-left">
              Your password must be 8-20 characters long.
            </div>
          </div>
          <button className="btn btn-primary">登入</button>
          </form>
        </div>
      </div>
      <p className="mt-5 mb-3 text-muted">&copy; 2025~∞ - 六角學院</p>
    </div>)}
    </>
  )
}

export default App
