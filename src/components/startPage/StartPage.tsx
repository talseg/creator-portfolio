
import pkg from "../../../package.json";
import cats from "../../images/cats.png";

export const StartPage: React.FC = () => {

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      maxWidth: "1280px",
      textAlign: "center",
      margin: "0",
    }}>
      <h1>
        <a href="https://www.orsegal.net">
          <div style={{
            fontSize: "50px", 
            margin: "0px",
            textDecoration: "underline"
          }}>Or Segal</div>
        </a>
      </h1>
      <h1 style={{ margin: "0px" }}>Portfolio</h1>
      <div>
        <button onClick={() => {}}>
          Upload
        </button>
      </div>
      <img src={cats} alt="Portfolio Image" 
        style={{ width: "90%", maxWidth: "600px" }}
      />
      <p
        style={{
          color: "#888"
        }}>
        version: {pkg.version}
      </p>
    </div>
  )
}