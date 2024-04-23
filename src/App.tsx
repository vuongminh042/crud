import { Route, Routes } from "react-router-dom"
import Layout from "./Layout"
import ProductList from "./ProductList"
import Signup from "./Signup"
import Signin from "./Signin"
import ProductAdd from "./ProductAdd"
import ProductEdit from "./ProductEdit"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<ProductAdd />} />
            <Route path="products/:id/edit" element={<ProductEdit />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signin" element={<Signin />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
