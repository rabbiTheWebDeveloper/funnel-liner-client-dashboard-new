import { Button } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../commonSection/Spinner/Spinner";
import { useToast } from "../../hook/useToast";
import SuperFetch from "../../hook/Axios";
import useLoading from "../../hook/useLoading";

const PasswordSetup = () => {
  const router = useRouter();
  const showToast = useToast();
  const [isBtnDisable, setIsBtnDisable] = useState(true);
  const [isLoading, startLoading, stopLoading] = useLoading();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSetupPassword = data => {
    startLoading();
    SuperFetch.post("/password-update", {
      phone: data?.phoneNumber,
      password: data?.password,
      hash: router?.query?.hash,
    })
      .then(response => {
        if (response?.status === 200 && response?.data?.success) {
          router.push("/login");
        } else {
          showToast(
            response?.data?.message?.includes("Invalid hash")
              ? "Invalid URL !"
              : response?.data?.message,
            "error"
          );
          stopLoading();
        }
      })
      .catch(error => {
        showToast("Something went wrong!", "error");
        stopLoading();
      });
  };

  useEffect(() => {
    if (router?.query?.hash) {
      setIsBtnDisable(false);
    }
  }, [router?.query?.hash]);

  return (
    <section className="Login">
      <div className="LoginContent">
        {router?.query?.hash === undefined || router?.query?.hash === "" ? (
          <h4 className="userPasswordSetupErrorMsg">
            Sorry! You aren't valid user
          </h4>
        ) : null}

        {/* Logo */}
        <div className="Logo">
          <img
            style={{ height: "50px", margin: "10px 0" }}
            src="/images/logo-beta.png"
            alt=""
          />
        </div>

        {/* HeaderText */}
        <div className="HeaderText">
          <h4>Setup your password</h4>
        </div>

        {/* form Part */}
        <div className="FormPart">
          <form onSubmit={handleSubmit(handleSetupPassword)}>
            <div className="customInput">
              <label style={{ display: "block", textAlign: "left" }}>
                Phone Number
              </label>
              <input
                type="text"
                {...register("phoneNumber", {
                  required: true,
                  minLength: 10,
                })}
                placeholder="Enter Your Phone Number"
              />
              <p style={{ textAlign: "left" }} className="error">
                {errors.phoneNumber && (
                  <span>Please Enter your valid phone number</span>
                )}
              </p>
            </div>
            <div className="customInput">
              <label style={{ display: "block", textAlign: "left" }}>
                Password
              </label>
              <input
                type="text"
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
                placeholder="Enter Your New Password"
              />
              <p style={{ textAlign: "left" }} className="error">
                {errors.password && (
                  <span>Please Enter your valid password</span>
                )}
              </p>
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
                  Submit
                </Button>
              ) : (
                <Button
                  key="login_submit_btn2"
                  disabled={isBtnDisable}
                  type="submit"
                  className="bg"
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PasswordSetup;
