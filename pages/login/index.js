import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mui/material";
import { detect } from "detect-browser";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import SuperFetch from "../../hook/Axios";
import { useToast } from "../../hook/useToast";
import styles from "./login.module.css";
import useLoading from "../../hook/useLoading";
import Spinner from "../../Components/commonSection/Spinner/Spinner";
import axios from "axios";
const publicIp = require("react-public-ip");

const Login_Part = () => {
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [browserName, setBrowserName] = useState("");
  const [suggestText, setSuggestText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const showToast = useToast();

  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is a required field"),
    password: yup.string().required("Password is a required field"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    getIpAddress();
  }, []);

  const getIpAddress = async () => {
    try {
      const ipAddress = (await publicIp.v4()) || "";
      const browserName =
        detect().name === "chrome" ? "Google Chrome" : detect().name;
      setIpAddress(ipAddress);
      setBrowserName(browserName);
    } catch (error) {}
  };

  const handleShow = () => {
    setShowPass(!showPass);
  };

  const onSubmit = async e => {
    e.preventDefault();

    startLoading();

    SuperFetch.post(
      "/login",
      { email: emailValue, password: passwordValue },
      {
        headers: {
          ipAddress: ipAddress,
          browserName: browserName,
        },
      }
    )
      .then(async response => {
        if (
          response.data.success === true ||
          response.data?.error_type === "PartialAuthorized"
        ) {
          if (response.data.data.phone_verified !== true) {
            window.location.href = `https://funnelliner.com/signup?unverified_user=${emailValue}`;
          }
          if (response.data.data.phone_verified) {
            await login();
            showToast(response.data.message, "success");
            Cookies.set("token", response.data.token, {
              sameSite: "strict",
              expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            });
            Cookies.set("user", JSON.stringify(response.data.data), {
              sameSite: "strict",
              expires: new Date(Date.now() + 24 * 60  * 60 * 1000),
            });
            setEmailValue("");
            reset();
            window.location.href = "/";
          }
        } else {
          showToast(response.data.message, "error");
          stopLoading();
        }
      })
      .catch(error => {
        showToast("Something went wrong!", "error");
        setErrorText("Something went wrong");
        stopLoading();
      });
  };

  setTimeout(function () {
    setErrorText("");
  }, 4000);

  const handleInputChange = event => {
    setEmailValue(event.target.value);
  };

  const handleSuggestionClick = suggestion => {
    if (
      !emailValue.includes("@gmail" || "@yahoo" || "@hotmail" || "@outlook")
    ) {
      setEmailValue(emailValue + suggestion);
      setShowSuggestions(false);
    } else {
      setSuggestText(emailValue);
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (emailValue) setShowSuggestions(true);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "https://funnelliner-report-api.vercel.app/api/v1/auth/login",
        {
          email: emailValue,
          password: passwordValue,
        }
      );

      console.log("Login successful:", response.data);
      return response.data;
    } catch (error) {
      // console.error('Error logging in:', error.response ? error.response.data : error.message);
      // throw error;
    }
  };
  return (
    <section className={styles.login}>
      <div className={`${styles.loginContent} ${styles.boxShadow}`}>
        <div className={styles.loginFlex}>
          <div className={styles.logo}>
            <div className={styles.img}>
              <img src="/images/logo-beta.png" alt="" />
            </div>
            <div className={styles.text}>
              <h2>Welcome To</h2>
              <p>
                The First Automated E-Commerce <br /> Sales Funnel In Bangladesh
              </p>
            </div>
          </div>

          <div className={styles.formValidation}>
            <form onSubmit={onSubmit}>
              <div className="customInput">
                <label>Phone Number or Email</label>
                <input
                  type="text"
                  {...register("email")}
                  value={emailValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  // {...register('email')}
                  placeholder="Please enter your Phone Number or Email"
                />
                {errors.email &&
                  (isSubmitted || errors.email.type === "manual") && (
                    <p className="error">{errors.email.message}</p>
                  )}
                {showSuggestions ? (
                  <div className={styles.suggestion}>
                    <ul>
                      <li onClick={() => handleSuggestionClick("@gmail.com")}>
                        @gmail.com
                      </li>
                      <li onClick={() => handleSuggestionClick("@yahoo.com")}>
                        @yahoo.com
                      </li>
                      <li onClick={() => handleSuggestionClick("@hotmail.com")}>
                        @hotmail.com
                      </li>
                      <li onClick={() => handleSuggestionClick("@outlook.com")}>
                        @outlook.com
                      </li>
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="customInput">
                <label>Password</label>
                <input
                  type={showPass ? "password" : "text"}
                  placeholder="password"
                  // {...register('password')}
                  onChange={e => setPasswordValue(e.target.value)}
                />
                <div className="eye" onClick={handleShow}>
                  {showPass ? (
                    <i className="flaticon-hidden"></i>
                  ) : (
                    <i className="flaticon-eye"></i>
                  )}
                </div>
                {errors.password &&
                (errors.password.type === "required" ||
                  errors.password.type === "manual") ? (
                  <p className="error">{errors.password.message}</p>
                ) : null}
              </div>

              <div className="customInput">
                {isLoading ? (
                  <Button
                    key="login_submit_btn1"
                    disabled
                    type="submit"
                    className="bg"
                  >
                    <Spinner key="login_submit_btn1_Spinner" />
                    Login
                  </Button>
                ) : (
                  <Button key="login_submit_btn2" type="submit" className="bg">
                    Login
                  </Button>
                )}
              </div>

              <div className={styles.forgetPassword}>
                <Link href="/forget-password">Forgot Password?</Link>
              </div>

              <div className={styles.noAccount}>
                <p>
                  Don't have an account?{" "}
                  <Link href="https://app.funnelliner.com/offer">Register</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login_Part;
