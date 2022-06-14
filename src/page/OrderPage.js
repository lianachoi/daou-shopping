import "../App.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router";

function OrderPage(props) {
  let location = useLocation();
  const order = location.state.order;
  const [itemList, setItemList] = useState([]);
  const [total, setTotal] = useState([]);
  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat("ko-KR");

  const addComma = (value) => formatter.format(Number(value));

  useEffect(() => {
    Axios.get("/api/v1/orders/" + order.orderId).then((response) => {
      //   console.log(response.data.itemList);
      //   console.log(response.data.order);
      setItemList(response.data.itemList);
      let itemPrice = 0;
      response.data.itemList.forEach((element) => {
        itemPrice += (element.price - element.salePrice) * element.qty;
      });
      setTotal(itemPrice);
    });
  }, []);
  const cancelOrder = (e) => {
    let result = window.confirm("주문이 취소됩니다.");
    if (result) {
      Axios.delete("/api/v1/orders/" + order.orderId).then((response) => {
        navigate("/orderPage", {
          replace: false,
          state: { order: response.data },
        });
      });
    }
  };
  //   console.log(order);
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
                  <td>{addComma(element.price)}</td>
                  <td>{element.qty}</td>
                  <td>{addComma(element.price * element.qty)}</td>
                  <td>
                    {order.status === 1
                      ? "결제 대기"
                      : order.status === 2
                      ? "결제 완료"
                      : "결제 취소"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="container-input"
        style={{
          textAlign: "left",
          paddingLeft: "10%",
          paddingRight: "10%",
          height: "360px",
        }}
      >
        <div>
          <h2>주문 금액: {addComma(total)}</h2>
        </div>
        <div>{order.userId ? "ID: " + order.userId : ""}</div>
        <div>이름:{order.userName}</div>
        <div>주소:{order.address1}</div>
        <div>상세주소:{order.address2}</div>
        <div>
          <h4 style={{ height: "40px" }}>
            사용 포인트:{addComma(order.usePoint)}
            <br />
            쿠폰 사용 금액:{addComma(order.useCoupon)}
          </h4>
        </div>
        <div>결제 수단:{order.useCard ? "카드결제" : "계좌이체"}</div>
        {order.useCard ? (
          <>
            {/* <div>결제 카드: {order.card}</div> 카드 결제 내역도 가져와야함*/}
            <div>
              결제 금액: {addComma(total - order.usePoint - order.useCoupon)}
            </div>
          </>
        ) : (
          <>
            <div>입금 계좌: {order.vaccount}</div>
            <div>
              입금 금액: {addComma(total - order.usePoint - order.useCoupon)}
            </div>
          </>
        )}
        <br />
        <button
          onClick={cancelOrder}
          style={{
            height: "50px",
            visibility: order.status === 3 ? "hidden" : "visible",
          }}
          name="cancle"
          id="cancle"
        >
          주문 취소
        </button>
      </div>
    </>
  );
}

export default OrderPage;
