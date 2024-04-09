import classes from "./Home.module.css";

function Home() {
  return (
    <main className={classes.main_home}>
      <h1>
        Browse and save <span>art.</span>
      </h1>
      <div className={classes.paintings}>
        <div className={classes.img_one}>
          <img src="/birthofvenus.jpg" alt="painting image" />
        </div>
        <div className={classes.img_two}>
          <img src="/monalisa.jpg" alt="painting image" />
        </div>
        <div className={classes.img_three}>
          <img src="/self-portrait-as-a-tehuana.jpg" alt="painting image" />
        </div>
        <div className={classes.img_four}>
          <img src="/girlpearlearing.jpg" alt="painting image" />
        </div>
      </div>
    </main>
  );
}

export default Home;
