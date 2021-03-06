import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ItemPage from "./page/ItemPage";
import MainPage from "./page/Main";
import NewOrder from "./page/NewOrder";
import OrderPage from "./page/OrderPage";
import PayPage from "./page/PayPage";
import SearchOrder from "./page/SearchOrder";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/itemPage/:itemId" element={<ItemPage />} />
          <Route path="/newOrder" element={<NewOrder />} />
          <Route path="/orderPage" element={<OrderPage />} />
          <Route path="/searchOrder" element={<SearchOrder />} />
          <Route path="/payPage" element={<PayPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
