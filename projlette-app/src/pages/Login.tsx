import { signInWithEmailAndPassword } from "firebase/auth";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
// @ts-ignore
import Header from "../components/header/Header";
import { auth } from "../firebase/firebase";

export default function Login() {
  const [error, setError] = React.useState<string | null>(null);
  const navigator = useNavigate();
  const onLogin = () => {
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
		navigator(-1);
      })
      .catch((error) => {
        setError(error.message);
        console.log(JSON.stringify(error));
      });
  };

  return (
    <div className="App">
      <section className="hero is-small is-info">
        <div className="hero-head">
          <Header />
        </div>

        <div className="hero-body">
          <div className="container has-text-centered">
            <p className="title">Login to Projlette</p>
            <br />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="box">
                <h1 className="title">Login</h1>
                <p className="subtitle">Enter your credentials to login to your account.</p>
                <form>
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="Email or Username"
                        id="email"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        placeholder="Password"
                        id="password"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <button
                        type="button"
                        className="button is-success"
                        onClick={onLogin}
						style={{
							verticalAlign: "middle",
						}}
                      >
                        Login
                      </button>
					  <Link to="/signup" className="ml-4" style={{
						verticalAlign: "middle",
					}}>Create an account</Link>
					&nbsp;&nbsp;|&nbsp;&nbsp;
					  <a href="#" style={{
						verticalAlign: "middle",
					}}>Send password reset</a>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <p className="help is-danger">{error}</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
