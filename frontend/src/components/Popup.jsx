import { useNavigate } from "react-router-dom";

import classes from "./Popup.module.css";

function Popup({ message, redirect }) {
  let navigate = useNavigate();

  function redirect(redirect) {
    if (redirect == "reload") {
      window.location.reload();
      return;
    }
    navigate(redirect);
  }

  return (
    <div className={classes.backdrop}>
      <div className={classes.popup}>
        <h1>Error</h1>
        <p>{message}</p>
        <div>
          <button onClick={() => redirect(redirect)}>Reload</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
