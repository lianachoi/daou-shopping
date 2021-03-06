import "../App.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router";

function PayPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    orderId: "",
    userName: "",
  });
  const [account, setAccount] = useState({
    accountId: "",
    valance: 0,
  });
  const [toAccount, setToAccount] = useState({
    accountId: "",
    valance: 0,
  });
  const [total, setTotal] = useState([]);

  const [itemList, setItemList] = useState([]);
  const formatter = new Intl.NumberFormat("ko-KR");
  const addComma = (value) => formatter.format(Number(value));

  const changeAccountIdInput = (e) => {
    setAccount({ ...account, accountId: e.target.value });
  };
  const changeToAccountIdInput = (e) => {
    setToAccount({ ...toAccount, accountId: e.target.value });
  };
  const keyDown = (e) => {
    if (e.key == "Enter") {
      getAccount();
    }
  };
  const keyDownTo = (e) => {
    if (e.key == "Enter") {
      getVAccount();
    }
  };

  const getAccount = (e) => {
    Axios.get("/api/v1/pay/account/" + account.accountId)
      .then((response) => {
        setAccount(response.data);
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  };

  const getVAccount = (e) => {
    Axios.get("/api/v1/pay/account/" + toAccount.accountId + "/order")
      .then((response) => {
        setOrder(response.data.order);
        setItemList(response.data.itemList);
        let itemPrice = 0;
        response.data.itemList.forEach((element) => {
          itemPrice += (element.price - element.salePrice) * element.qty;
        });
        setTotal(itemPrice);
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  };

  const transfer = () => {
    let accountHis = {
      fromId: account.accountId,
      toId: toAccount.accountId,
      tranDate: moment(Date()).format("YYYY-MM-DD"),
      tranAmount: total - order.usePoint - order.useCoupon,
    };
    Axios.put("/api/v1/pay/account", accountHis)
      .then((response) => {
        alert("????????? ?????????????????????.");
        navigate("/");
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  };
  //   console.log(order);
  return (
    <>
      <h1 class="main-header">
        <Link class="main-header-button" to="/searchOrder">
          <button type="button">?????? ??????</button>
        </Link>
        <a href="/" className="black">
          DAOU Shopping
        </a>
        <Link class="main-header-button" to="/payPage">
          <button type="button">?????? ??????</button>
        </Link>
      </h1>
      <h3>?????? ??????</h3>
      <br />
      ?????? ??????:{" "}
      <input
        value={account.accountId}
        onChange={changeAccountIdInput}
        onKeyDown={keyDown}
        id="accountId"
        disabled={account.valance !== 0}
      ></input>
      / ??????:{addComma(account.valance)}
      <br />
      <button onClick={getAccount} disabled={account.valance !== 0}>
        ??????
      </button>{" "}
      <button
        onClick={() => {
          setAccount({
            accountId: "",
            valance: 0,
          });
        }}
      >
        ?????? ?????? ????????????
      </button>
      <br />
      <br />
      <br />
      <br />
      {account.valance > 0 ? (
        <>
          ?????? ?????? ??????:{" "}
          <input
            value={toAccount.accountId}
            onChange={changeToAccountIdInput}
            onKeyDown={keyDownTo}
            id="toAccountId"
          ></input>
          / ?????? ?????? ??????:
          {addComma(total - order.usePoint - order.useCoupon || 0)}
          <br />
          <button
            onClick={transfer}
            style={{
              visibility:
                total - order.usePoint - order.useCoupon > 0
                  ? "visible"
                  : "hidden",
            }}
            disabled={
              account.valance < total - order.usePoint - order.useCoupon
            }
          >
            ??????
          </button>{" "}
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default PayPage;
