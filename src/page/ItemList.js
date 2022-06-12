import "../App.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

function ItemList() {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    Axios.get("/api/v1/items").then((response) => {
      setItemList(response.data);
    });
  }, []);

  return (
    <>
      {itemList.map((element) => (
        <div key={element.itemId} className="item-container">
          <Link to={`/itemPage/${element.itemId}`}>
            <div className="item-all">
              <div className="item-image">
                <img
                  className="item-image"
                  src={"http://localhost:8080/static/" + element.itemImage}
                  alt={element.itemName}
                />
              </div>
              <div className="item-info">
                <div className="item-info-name black">{element.itemName}</div>
                <div className="item-info-price crimson">
                  {element.price} 원
                </div>
                <div className="item-info-desc black">{element.itemDesc}</div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
}

export default ItemList;
