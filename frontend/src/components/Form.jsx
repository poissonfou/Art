import { Form } from "react-router-dom";

import classes from "./Form.module.css";

function FormLayout({ children }) {
  return (
    <Form method="post" className={classes.login_form}>
      {children}
    </Form>
  );
}

export default FormLayout;
