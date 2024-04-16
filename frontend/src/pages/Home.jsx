import classes from "./Home.module.css";

function Home() {
  return (
    <>
      <main className={classes.main_home}>
        <section>
          <div className={classes.hero_text}>
            <h1>Browse|Discover|Share</h1>
            <span>ART</span>
          </div>
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
        </section>
        <section className={classes.board_info}>
          <img src="/board.jpeg" alt="site image" />
          <h1>
            Browse through a vast collection of{" "}
            <span>high res, free images</span> from different artists{" "}
            <span>all over the globe.</span>
          </h1>
        </section>
        <section className={classes.collections_info}>
          <div>
            <img src="/collection_two.png" alt="site image" />
            <img src="/collection.png" alt="site image" />
          </div>
          <div>
            <h1>Collections</h1>
            <p>
              Group your saved paintings to easily access paintings with similar
              themes, styles, or any other caracteristic. You can edit them at
              any time.
            </p>
          </div>
        </section>
        <section className={classes.details}>
          <div>
            <h1>Download</h1>
            <p>
              Besides viewing information about the painting and saving it to
              your profile, you can download a high resolution copy{" "}
              <span>for free.</span>
            </p>
          </div>
          <img src="/details.png" alt="site image" />
        </section>
      </main>
      <footer>
        <div className={classes.techs}>
          <p>Created with:</p>
          <div>
            <figure>
              <figcaption>Frontend</figcaption>
              <ul>
                <li>React</li>
                <li>React Router</li>
                <li>Redux</li>
              </ul>
            </figure>

            <figure>
              <figcaption>Backend</figcaption>
              <ul>
                <li>Node.js</li>
                <li>Mongoose</li>
                <li>Express.js</li>
              </ul>
            </figure>
          </div>
        </div>
        <div className={classes.contact}>
          <p>Emerson Lima | 2024</p>
          <div>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=emersonlimago123@gmail.com">
              <i class="bi bi-envelope"></i>
            </a>
            <a href="https://www.linkedin.com/in/emerson-lima-%F0%9F%8F%B3%EF%B8%8F%E2%80%8D%F0%9F%8C%88-000986237/">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="https://github.com/poissonfou">
              <i className="bi bi-github"></i>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
