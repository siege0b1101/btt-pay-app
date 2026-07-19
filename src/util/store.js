import { createStore, action, thunk } from "easy-peasy";
import { modalHeaders, modalType } from "./modalContent";
import jwtDecode from "jwt-decode";
import api from "../adapters/api";

const model = {
  userSession: localStorage.userSession
    ? JSON.parse(localStorage.userSession)
    : null,
  setUserSession: action((state, payload) => {
    state.userSession = payload;
    localStorage.setItem("userSession", JSON.stringify(payload));
  }),
  accounts: [],
  setAccounts: action((state, payload) => {
    state.accounts = payload;
  }),
  errorMsg: null,
  setErrorMsg: action((state, payload) => {
    state.errorMsg = payload;
  }),
  showModal: {
    header: "",
    body: "",
    visible: false,
    type: "INFO",
    callback: null,
  },
  setShowModal: action((state, payload) => {
    state.showModal = payload;
  }),
  isLoading: false,
  setIsLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
  isMobileMenuClicked: false,
  setIsMobileMenuClicked: action((state, payload) => {
    state.isMobileMenuClicked = payload;
  }),
  login: thunk(async (actions, request, helper) => {
    const { setErrorMsg, setUserSession } = helper.getStoreActions();
    let successful = true;

    try {
      const response = await api.post("/api/auth/login", request);
      setUserSession(response.data);
    } catch (e) {
      setErrorMsg(e.response.data.message);
      successful = false;
    } finally {
      return successful;
    }
  }),
  logout: thunk(async (actions, request, helper) => {
    const { userSession } = helper.getState();
    const { setUserSession, setShowModal } = helper.getStoreActions();

    try {
      const response = await api.post("/api/auth/logout", null, {
        headers: { Authorization: `Bearer ${userSession.token}` },
      });

      setUserSession(null);
      localStorage.clear();

      setShowModal({
        header: modalHeaders.LOGOUT,
        body: response.data.message,
        visible: true,
        type: modalType.INFO,
      });
    } catch (e) {
      console.log(e);
    }
  }),
  registerUser: thunk(async (actions, request, helper) => {
    const { setShowModal } = helper.getStoreActions();

    try {
      const response = await api.post("/api/auth/register", request);

      setShowModal({
        header: modalHeaders.REGISTRATION,
        body: response.data.message,
        visible: true,
        type: modalType.INFO,
      });
    } catch (e) {
      console.log(e);
    }
  }),
  retrieveUserAccounts: thunk(async (actions, payload, helper) => {
    const { setAccounts, setIsLoading } = helper.getStoreActions();

    setIsLoading(true);

    const token = payload;
    const id = jwtDecode(token).userId;

    try {
      const URL = "/api/accounts/user?";
      const response = await api.post(`${URL}id=${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const accounts = response.data;
      setAccounts(accounts);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }),
  openAccount: thunk(async (actions, payload, helper) => {
    const { setShowModal, retrieveUserAccounts } = helper.getStoreActions();
    const { type, token } = payload;
    const id = jwtDecode(token).userId;

    try {
      const data = { accountType: type, userId: id };

      const response = await api.post("/api/accounts", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowModal({
        header: modalHeaders.OPEN_ACCOUNT,
        body: response.data.message,
        visible: true,
        type: modalType.INFO,
      });

      retrieveUserAccounts(token);
    } catch (e) {
      console.log(e);
    }
  }),
  retrieveTransactions: thunk(async (actions, payload, helper) => {
    const { userSession } = helper.getState();

    let transactionList = [];

    try {
      const URL = "/api/transactions/account?";
      const response = await api.post(`${URL}accountNumber=${payload}`, null, {
        headers: { Authorization: `Bearer ${userSession.token}` },
      });

      transactionList = response.data;
    } catch (e) {
      console.log(e);
    } finally {
      return transactionList;
    }
  }),
  cashIn: thunk(async (actions, payload, helper) => {
    const { userSession } = helper.getState();
    const { setShowModal } = helper.getStoreActions();

    try {
      const response = await api.post("/api/transactions", payload, {
        headers: { Authorization: `Bearer ${userSession.token}` },
      });

      setShowModal({
        header: modalHeaders.CASH_IN,
        body: response.data.message,
        visible: true,
        type: modalType.INFO,
      });
    } catch (e) {
      console.log(e);
    }
  }),
  transferCoins: thunk(async (actions, payload, helper) => {
    const { userSession } = helper.getState();
    const { setShowModal, retrieveUserAccounts } = helper.getStoreActions();

    try {
      const senderData = {
        accountNumber: payload.fromAccountNumber,
        details: payload.details,
        amount: payload.amount,
        transactionType: payload.transactionType,
      };

      const receiverData = {
        accountNumber: payload.toAccountNumber,
        details: "RECEIVE COINS",
        amount: payload.amount,
        transactionType: "CREDIT",
      };

      let response = await api.post("/api/transactions", senderData, {
        headers: { Authorization: `Bearer ${userSession.token}` },
      });

      setShowModal({
        header: modalHeaders.TRANSFER_COINS,
        body: response.data.message,
        visible: true,
        type: modalType.INFO,
      });

      await api.post("/api/transactions", receiverData, {
        headers: { Authorization: `Bearer ${userSession.token}` },
      });

      retrieveUserAccounts(userSession.token);
    } catch (e) {
      console.log(e);
    }
  }),
  payBills: thunk(async (actions, payload, helper) => {
    const { userSession } = helper.getState();
    const { setShowModal } = helper.getStoreActions();

    try {
      const data = {
        accountNumber: payload.accountNumber,
        details: payload.details,
        amount: payload.amount,
        transactionType: payload.transactionType,
      };

      const response = await api.post("/api/transactions", data, {
        headers: { Authorization: `Bearer ${userSession.token}` },
      });

      setShowModal({
        header: modalHeaders.PAY_BILLS,
        body: response.data.message,
        visible: true,
        type: modalType.INFO,
      });
    } catch (e) {
      console.log(e);
    }
  }),
  buyLoad: thunk(async (actions, payload, helper) => {
    const { userSession } = helper.getState();
    const { setShowModal } = helper.getStoreActions();

    try {
      const data = {
        accountNumber: payload.accountNumber,
        details: payload.details,
        amount: payload.amount,
        transactionType: payload.transactionType,
      };

      const response = await api.post("/api/transactions", data, {
        headers: { Authorization: `Bearer ${userSession.token}` },
      });

      setShowModal({
        header: modalHeaders.BUY_LOAD,
        body: response.data.message,
        visible: true,
        type: modalType.INFO,
      });
    } catch (e) {
      console.log(e);
    }
  }),
};

export default createStore(model);
