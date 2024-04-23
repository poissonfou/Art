import { Form, useLocation } from "react-router-dom";
import { useState } from "react";

import classes from "./Form.module.css";

function FormLayout({ children }) {
  let route = useLocation();

  let showTab = window.innerWidth > 500;
  console.log(showTab);
  const [addBackgroundColor, setAddBackgroundColor] = useState(showTab);

  window.addEventListener("resize", (e) => {
    if (e.target.innerWidth < 500 && addBackgroundColor) {
      setAddBackgroundColor((prevState) => false);
    }

    if (e.target.innerWidth > 500 && !addBackgroundColor) {
      setAddBackgroundColor((prevState) => true);
    }
  });

  return (
    <Form
      method="post"
      className={`${classes.form} ${
        route.pathname == "/profile"
          ? classes.collection_form
          : classes.login_form
      } ${addBackgroundColor ? classes.black_background : ""}`}
    >
      {children}
    </Form>
  );
}

export default FormLayout;
