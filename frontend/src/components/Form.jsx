import { Form, useLocation } from "react-router-dom";

import classes from "./Form.module.css";

function FormLayout({ children }) {
  let route = useLocation();

  return (
    <Form
      method="post"
      className={`${classes.form} ${
        route.pathname == "/profile"
          ? classes.collection_form
          : classes.login_form
      }`}
    >
      {children}
    </Form>
  );
}

export default FormLayout;
