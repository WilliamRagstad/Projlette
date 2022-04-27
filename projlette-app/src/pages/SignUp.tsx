import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
// @ts-ignore
import Header from "../components/header/Header";
import { auth, db } from "../firebase/firebase";
import { formatUsername } from "../util/user";

export default function SignUp() {
  const [error, setError] = React.useState<string | null>(null);
  const navigator = useNavigate();

  const usernameExists = (uniqueUsername: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const user = await getDoc(doc(db, "users", uniqueUsername));
      if (user && user.exists() && user.data()) resolve(true);
      resolve(false);
    });
  };

  const onSignUp: React.FormEventHandler<HTMLFormElement> = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const fullname = (document.getElementById("fullname") as HTMLInputElement)
      .value;
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const repeatPassword = (
      document.getElementById("repeat-password") as HTMLInputElement
    ).value;
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    const uniqueUsername = formatUsername(username);
    usernameExists(uniqueUsername).then((exists) => {
      if (exists) {
        setError("Username already exists");
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          console.log(user);
          // Create a new user document
          setDoc(doc(db, "users", uniqueUsername), {
            email,
            name: fullname,
            username,
            role: "user",
			created: Timestamp.now(),
          })
            .then(() => {
              // New user is automatically signed in
              navigator("/");
            })
            .catch((err) => {
              setError(err.message);
            });
          // navigator(-1);
        })
        .catch((error) => {
          setError(error.message);
          console.log(JSON.stringify(error));
        });
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
            <p className="title">Sign up to Projlette</p>
            <br />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="box">
                <h1 className="title">Sign up</h1>
                <p className="subtitle">
                  Enter your credentials to sign up with a new account.
                </p>
                <form onSubmit={onSignUp}>
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="email"
                        placeholder="Email address"
                        id="email"
                        required
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Full name</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="fullname"
                        placeholder="Full name"
                        id="fullname"
                      />
                    </div>
                    <p className="help">(Optional)</p>
                  </div>
                  <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="username"
                        placeholder="Username"
                        id="username"
                        required
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
                        required
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        placeholder="Password"
                        id="repeat-password"
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <div className="control">
                      <label className="checkbox">
                        <input type="checkbox" id="tos" required />
                        &nbsp; I agree to the{" "}
                        <Link to="/terms" target="_blank">
                          terms and conditions.
                        </Link>
                      </label>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <button type="submit" className="button is-success">
                        Sign up
                      </button>
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
