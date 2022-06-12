import "../App.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import { Link, useLocation } from "react-router-dom";

function NewOrder(props) {
  const [user, setUser] = useState({
    userId: "",
    userPw: "",
  });

  const changeIdInput = (e) => {
    setUser({ ...user, userId: e.target.value });
  };

  const changePwInput = (e) => {
    setUser({ ...user, userPw: e.target.value });
  };
  const userLogin = (e) => {
    Axios.post("/api/v1/users", user).then((response) => {
      // setItemList(response.data);
      console.log(response.data);
    });
  };

  let location = useLocation();
  const mainItem = location.state.mainItem;
  const total = location.state.total;
  const data = location.state.data;
  //   console.log(data);
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
          {data.map((item) => (
            <div className="select-box">
              {item.optionName + " (+" + item.price + ") "}
              <div> 수량: {item.count}</div>
              <div>
                {" "}
                가격: {mainItem.price * item.count + item.price * item.count}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 유저정보/쿠폰 조회 */}
      <div className="container-input">
        <div className="select-option">
          id:{" "}
          <input
            id="userID"
            onChange={changeIdInput}
            value={user.userId}
            type={"text"}
          ></input>
        </div>
        <div className="select-option">
          pw:{" "}
          <input
            id="userPW"
            onChange={changePwInput}
            value={user.userPw}
            type={"password"}
          ></input>
        </div>
        <button onClick={userLogin}>내정보 조회</button>
      </div>
      <div>{total} 원</div>
    </>
  );
}

export default NewOrder;
