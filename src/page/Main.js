import React from "react";
import ItemList from "./ItemList";

const Main = (props) => {
  return (
    <>
      <h1>
        <a href="/" className="black">
          DAOU Shopping
        </a>
      </h1>
      <ItemList />
    </>
  );
};

export default Main;
