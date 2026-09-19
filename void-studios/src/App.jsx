import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ToastStack from './components/ToastStack'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LogoutPage from './pages/LogoutPage'
import WishlistPage from './pages/WishlistPage'
import AccountPage from './pages/AccountPage'
import SearchPage from './pages/SearchPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* one reusable listing page drives every collection route */}
          <Route path="/new-arrivals" element={<CategoryPage mode="collection" id="new-arrivals" />} />
          <Route path="/basics" element={<CategoryPage mode="collection" id="basics" />} />
          <Route path="/sale" element={<CategoryPage mode="collection" id="sale" />} />
          <Route path="/tops" element={<CategoryPage mode="category" id="tops" />} />
          <Route path="/tops/:subcategory" element={<CategoryPage mode="subcategory" id="tops" />} />
          <Route path="/bottoms" element={<CategoryPage mode="category" id="bottoms" />} />
          <Route path="/bottoms/:subcategory" element={<CategoryPage mode="subcategory" id="bottoms" />} />
          <Route path="/accessories" element={<CategoryPage mode="category" id="accessories" />} />

          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/search" element={<SearchPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <ToastStack />
    </div>
  )
}
