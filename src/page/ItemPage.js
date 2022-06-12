import "../App.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import { Link, useParams } from "react-router-dom";

function ItemPage() {
  const [status, setStatus] = useState(200);
  const [item, setItem] = useState({
    mainItem: {},
    addItem: [],
    itemGroup: [],
  });
  const [options, setOptions] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [total, setTotal] = useState(0);
  let params = useParams();
  let { itemId } = params;
  useEffect(() => {
    Axios.get("/api/v1/items/" + itemId)
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => {
        setStatus(error.response.status);
      });
    Axios.get("/api/v1/items/" + itemId + "/options").then((response) => {
      setOptions(response.data);
    });
  }, [itemId]);

  const onOptionChange = (e) => {
    if (e.target.value === "none") {
      return;
    }
    if (
      orderList.length !== 0 &&
      orderList.findIndex((element) => element.optionName === e.target.value) >
        -1
    ) {
      return;
    }
    let index = options.findIndex(
      (element) => element.optionName === e.target.value
    );
    let newItem = options[index];
    newItem.count = 1;
    // console.log(newItem);
    setOrderList(orderList.concat(newItem));
    setTotal(total + item.mainItem.price + newItem.price);
  };

  const minus = (e) => {
    let index = orderList.findIndex(
      (element) => element.optionId == e.target.id
    );
    if (index > -1) {
      let count = orderList[index].count;
      if (count > 0) {
        orderList[index] = { ...orderList[index], count: count - 1 };
        // console.log(orderList);
        setOrderList(orderList);
        setTotal(total - item.mainItem.price - orderList[index].price);
      }
    }
  };

  const plus = (e) => {
    let index = orderList.findIndex(
      (element) => element.optionId == e.target.id
    );
    if (index > -1) {
      let count = orderList[index].count;
      orderList[index] = { ...orderList[index], count: count + 1 };
      //   console.log(orderList);
      setOrderList(orderList);
      setTotal(total + item.mainItem.price + orderList[index].price);
    }
  };
  const letsOrder = (e) => {
    if (orderList.length === 0) {
      alert("옵션을 선택해 주세요");
      e.preventDefault();
      return;
    }
    if (total === 0) {
      alert("수량을 선택해 주세요");
      e.preventDefault();
      return;
    }
  };

  return (
    <>
      <h1>
        <a href="/" className="black">
          DAOU Shopping
        </a>
      </h1>

      <div className="item-detail">
        {status === 200 ? (
          <>
            <div className="container">
              <div>
                <img
                  className="item-detail-image"
                  src={
                    "http://localhost:8080/static/" + item.mainItem.itemImage
                  }
                  alt={item.mainItem.itemName}
                />
              </div>
              {/* 주문 선택 하는곳 */}
              <div className="order-box">
                <h3 align="center">{item.mainItem.itemName}</h3>
                <div
                  style={{ textAlign: "right" }}
                  className="item-info-price crimson"
                >
                  {item.mainItem.price} 원
                </div>
                <h3 style={{ textAlign: "left", height: "20px" }}>구성</h3>
                <select
                  onChange={(e) => onOptionChange(e)}
                  id="option"
                  title="구성"
                  className="select-option"
                >
                  <option value="none" key="none">
                    --옵션을 선택하세요--
                  </option>
                  {options.map((item) => (
                    <option value={item.optionName} key={item.optionId}>
                      {item.optionName} + {item.price} 원
                    </option>
                  ))}
                </select>

                <h3 style={{ textAlign: "left", height: "20px" }}>추가상품</h3>
                {item.itemGroup.map((group) => (
                  <div style={{ textAlign: "left" }}>
                    {group}
                    <br />
                    <select
                      id="add"
                      title={{ group }}
                      className="select-option"
                    >
                      <option value="none" key="none">
                        --{group}--
                      </option>
                      {item.addItem.map((item) =>
                        group === item.pgroupName ? (
                          <option value={item.itemName} key={item.itemId}>
                            {item.itemName} + {item.price} 원
                          </option>
                        ) : (
                          <></>
                        )
                      )}
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {orderList.map((item) => (
                <div className="select-box">
                  {item.optionName + " (+" + item.price + ") "}
                  <br />
                  <div>
                    <button id={item.optionId} onClick={minus}>
                      -
                    </button>
                    {item.count}
                    <button id={item.optionId} onClick={plus}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="item-info-price"
              style={{ textAlign: "center", color: "black" }}
            >
              전체금액 : {total}
              <br />
              <Link
                to={"/newOrder"}
                state={{
                  data: orderList,
                  mainItem: item.mainItem,
                  total: total,
                }}
                onClick={letsOrder}
              >
                <button>주문하기</button>
              </Link>
            </div>
            {item.mainItem.itemDesc}
            <div>
              <img
                style={{ width: "80%" }}
                src={"http://localhost:8080/static/" + item.mainItem.descImage}
                alt={item.mainItem.itemName}
              />
            </div>
          </>
        ) : (
          "해당 제품을 찾을 수 없습니다."
        )}
      </div>
    </>
  );
}

export default ItemPage;
