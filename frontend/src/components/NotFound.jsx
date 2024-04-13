import classes from "./NotFound.module.css";

import Header from "./Header";

function NotFound() {
  return (
    <>
      <Header />
      <div className={classes.not_found}>
        <h1>Not Found!</h1>
        <span className="material-symbols-outlined">cancel</span>
      </div>
    </>
  );
}

export default NotFound;
