import "../App.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";

function OrderPage(props) {
  let location = useLocation();
  const order = location.state.order;
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    Axios.get("/api/v1/orders/" + order.orderId).then((response) => {
      //   console.log(response.data.itemList);
      //   console.log(response.data.order);
      setItemList(response.data.itemList);
    });
  }, []);
  //   console.log(order);
  return (
    <>
      <h1>
        <a href="/" className="black">
          DAOU Shopping
        </a>
      </h1>
      <div
        className="order-box"
        style={{ height: 300 + 100 * itemList.length + "px" }}
      >
        <h3>결제 상세 정보</h3>
        <br />
        결제 일자: {moment(order.orderDate).format("YYYY-MM-DD")}/ 주문번호:{" "}
        {order.orderId}
        <br />
        <br />
        <br />
        <div>
          <table style={{ width: "80%" }}>
            <tbody>
              <th colSpan={2}>상품정보</th>
              <th>상품금액</th>
              <th>수량</th>
              <th>주문금액</th>
              <th>진행상태</th>
              {itemList.map((element) => (
                <tr>
                  <td>
                    <div className="item-image">
                      <img
                        className="item-image"
                        src={
                          "http://localhost:8080/static/" + element.itemImage
                        }
                        alt={element.itemName}
                      />
                    </div>
                  </td>
                  <td>{element.itemName}</td>
                  <td>{element.price}</td>
                  <td>{element.qty}</td>
                  <td>{element.price * element.qty}</td>
                  <td>{order.status === 1 ? "결제 대기" : "결제 완료"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default OrderPage;
