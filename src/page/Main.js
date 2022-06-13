import React from "react";
import ItemList from "./ItemList";
import { Link } from "react-router-dom";

const Main = (props) => {
  return (
    <>
      <h1 class="main-header">
        <Link class="main-header-button" to="/searchOrder">
          <button type="button">주문 조회</button>
        </Link>
        <a href="/" className="black">
          DAOU Shopping
        </a>
        <Link class="main-header-button" to="/payPage">
          <button type="button">계좌 이체</button>
        </Link>
      </h1>
      <ItemList />
    </>
  );
};

export default Main;
