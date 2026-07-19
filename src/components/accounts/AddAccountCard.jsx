import { useStoreState, useStoreActions } from "easy-peasy";
import { MdSavings, MdPayments } from "react-icons/md";
import { modalHeaders, modalType } from "../../util/modalContent";
import errorMessages from "../../util/errorMessages";

const AddAccountCard = ({ type }) => {
  const userSession = useStoreState((state) => state.userSession);
  const { openAccount, setShowModal } = useStoreActions((action) => ({
    openAccount: action.openAccount,
    setShowModal: action.setShowModal,
  }));

  const isSavings = type === "SAVINGS";
  const textColor = {
    SAVINGS: "text-emerald-800",
    PAY: "text-cyan-800",
  };

  const handleClick = () => {
    setShowModal({
      header: modalHeaders.OPEN_ACCOUNT,
      body: errorMessages.CONFIRM_OPEN_ACCOUNT.replace("%", type),
      visible: true,
      type: modalType.CONFIRM,
      callback: {
        action: openAccount,
        args: { type: type, token: userSession.token },
      },
    });
  };

  return (
    <div className="grid justify-center items-center max-w-xl">
      <button
        onClick={handleClick}
        className={`flex flex-col items-center min-w-[20rem] p-5 rounded-md shadow-md hover:brightness-110 hover:shadow-xl bg-amber-100 ${textColor[type]}`}
      >
        <span className="text-9xl">
          {isSavings ? <MdSavings /> : <MdPayments />}
        </span>
        <span className="text-lg">{`Open a ${type} account`}</span>
      </button>
    </div>
  );
};

export default AddAccountCard;
