import "../App.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router";

function NewOrder(props) {
  let location = useLocation();
  const mainItem = location.state.mainItem;
  const total = location.state.total;
  const data = location.state.data;
  const navigate = useNavigate();
  //   console.log(data);
  const [order, setOrder] = useState({
    orderId: "",
    userId: "",
    usePoint: 0,
    forTransaction: false,
  });
  const [user, setUser] = useState({
    userId: "",
    userPw: "",
    userName: "",
    address1: "",
    address2: "",
    point: 0,
    login: false,
  });

  const [coupon, setCoupon] = useState([
    {
      couponId: 0,
      couponName: "--쿠폰이 없습니다.--",
      cMin: 0,
      usePercent: false,
      cPercentLimit: 0,
      cPrice: 0,
      cPercent: 0,
      expire: new Date(),
      calValue: 0,
    },
  ]);

  const changeInput = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    if (order.forTransaction) {
      Axios.post("/api/v1/orders", { order: order, list: data }).then(
        (response) => {
          navigate("/orderPage", {
            replace: false,
            state: { order: response.data },
          });
        }
      );
    }
  }, [order]);

  const changePointInput = (e) => {
    if (e.target.id === "pointButton" && user.point > 0) {
      setOrder({ ...order, usePoint: user.point });
    } else if (
      typeof Number(e.target.value) === "number" &&
      Number(e.target.value) <= user.point
    ) {
      let points = Number(e.target.value);
      setOrder({ ...order, usePoint: points });
    }
  };

  //   const changePwInput = (e) => {
  //     setUser({ ...user, userPw: e.target.value });
  //   };
  const keyDownPw = (e) => {
    // console.log(e.key);
    if (e.key == "Enter") {
      userLogin();
    }
  };
  const userLogin = (e) => {
    Axios.post("/api/v1/users", user)
      .then((response) => {
        if (response.data.userId == user.userId) {
          response.data.login = true;
          setUser(response.data);
          Axios.get(
            "/api/v1/users/" + user.userId + "/coupons?price=" + total
          ).then((response) => {
            // console.log(response.data[0].calValue);
            if (response.data.length > 0) {
              let calValue = response.data[0].calValue;
              let seq = response.data[0].seq;
              setCoupon(response.data);
              setOrder({ ...order, useCoupon: calValue, couponSeq: seq });
            }
          });
        }
      })
      .catch((error) => {
        // console.log(error.response);
        alert(error.response.data.error);
      });
  };

  const onOptionChange = (e) => {
    let index = coupon.findIndex(
      (element) => element.couponName === e.target.value
    );
    if (coupon.length !== 0 && index === -1) {
      return;
    }

    let newItem = coupon[index];
    setOrder({ ...order, useCoupon: newItem.calValue, couponSeq: newItem.seq });
  };

  const excute = (e) => {
    if (!user.userName) {
      alert("이름을 입력해 주세요");
      e.preventDefault();
      return;
    }
    if (!user.address1) {
      alert("주소를 입력해 주세요");
      e.preventDefault();
      return;
    }
    let cost = total - (order.usePoint || 0) - (order.useCoupon || 0);
    // 입금만 먼저,,
    setOrder({
      ...order,
      userId: user.userId,
      orderDate: new Date(),
      newPoint: cost * 0.1,
      status: 1,
      useCard: false,
      vAccount: "우리 1002-958-955-866",
      forTransaction: true,
      userName: user.userName,
      address1: user.address1,
      address2: user.address2,
    });
  };
  return (
    <>
      <h1>
        <a href="/" className="black">
          DAOU Shopping
        </a>
      </h1>
      <div className="order-box">
        <h3>주문하기</h3>
        <div>
          <img
            className="item-image"
            src={"http://localhost:8080/static/" + mainItem.itemImage}
            alt={mainItem.itemName}
          />
        </div>
        {mainItem.itemName}
        <br />
        가격: {mainItem.price}
        <div>
          {data.map((item) =>
            item.qty === 0 ? (
              <></>
            ) : (
              <div className="select-box">
                {item.optionName + " (+" + item.price + ") "}
                <div> 수량: {item.qty}</div>
                <div>
                  {" "}
                  가격: {mainItem.price * item.qty + item.price * item.qty}
                </div>
              </div>
            )
          )}
        </div>
      </div>
      {/* 유저정보/쿠폰 조회 */}
      <div className="container-input">
        <div className="select-option">
          ID:{" "}
          <input
            id="userId"
            onChange={changeInput}
            value={user.userId}
            type={"text"}
            disabled={user.login}
          ></input>
        </div>
        <div className="select-option">
          PW:{" "}
          <input
            id="userPw"
            onChange={changeInput}
            onKeyDown={keyDownPw}
            value={user.userPw}
            type={"password"}
            disabled={user.login}
          ></input>
        </div>

        <div className="select-option">
          <button
            onClick={userLogin}
            //   disabled={user.login}
          >
            내정보 조회
          </button>{" "}
          * 로그인 하지 않으면 비회원으로 주문됩니다.
        </div>
        <div className="select-option">
          이름:{" "}
          <input
            id="userName"
            onChange={changeInput}
            value={user.userName}
          ></input>
        </div>
        <div className="select-option">
          주소:{" "}
          <input
            id="address1"
            onChange={changeInput}
            value={user.address1}
          ></input>
        </div>
        <div className="select-option">
          상세주소:{" "}
          <input
            id="address2"
            onChange={changeInput}
            value={user.address2}
          ></input>
        </div>
        <div className="select-option">
          보유 포인트:{" "}
          <input
            value={order.usePoint}
            onChange={changePointInput}
            id="usePoint"
            type="number"
          ></input>{" "}
          / <input id="point" value={user.point} disabled={true}></input>
          <button
            name="pointButton"
            id="pointButton"
            onClick={changePointInput}
            disabled={!user.login}
          >
            전부 사용하기
          </button>
        </div>
        <div className="select-option">
          보유 쿠폰:{" "}
          <select
            id="coupon"
            disabled={!user.login}
            onChange={(e) => onOptionChange(e)}
          >
            {coupon.map((item) => (
              <option value={item.couponName} key={item.couponId}>
                {item.couponName} {"("}
                {moment(item.expire).format("YYYY-MM-DD")} {")"}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* 최종금액확인
      쿠폰금액, 포인트 금액 등이 넘을 경우 validation필요 */}
      <div
        className="container-input"
        style={{ fontSize: "20px", padding: "30px", height: "150px" }}
      >
        구매 금액 {total} 원
        <br />
        포인트 할인 금액 -{order.usePoint}원
        <br />
        쿠폰 할인 금액 -{order.useCoupon || 0}원
        <br />
        결제 금액 {total - (order.usePoint || 0) - (order.useCoupon || 0)}원
        <br />
        {"("}총 할인 금액: {(order.usePoint || 0) + (order.useCoupon || 0)}원
        {")"}
      </div>
      {/* 결제수단 선택 */}
      <div
        className="container-input"
        style={{ padding: "30px", height: "150px" }}
      >
        <label>
          <input className="radio" type="radio" id="card" checked={false} />
          카드결제
        </label>
        <label>
          <input className="radio" type="radio" id="account" checked={true} />
          계좌이체
        </label>
        <br />
        <button
          style={{ height: "50px" }}
          name="excute"
          id="excute"
          onClick={excute}
        >
          결제하기
        </button>
      </div>
    </>
  );
}

export default NewOrder;
