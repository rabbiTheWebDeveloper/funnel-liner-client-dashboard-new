import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { activateCourier } from "../../pages/api";
import { useRouter } from "next/router";
import { useToast } from "../../hook/useToast";
import CopyIcon from "../UI/CopyIcon/CopyIcon";

const Pathao = ({
  pathaoData,
  showPathaoSicrets,
  hanldeInputTypeChange,
  startLoading,
  stopLoading,
  merchantId,
}) => {
  const showToast = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const decodeJson = (data) => {
    return data === undefined ? 0 : JSON.parse(data);
  };

  const handlePathaoSubmit = (data) => {
    startLoading();
    const config = {
      client_id: data.client_id,
      client_secret: data.client_secret,
      username: data.username,
      password: data.password,
      grant_type: "password",
      store_id: data.store_id,
    };
    const configData = JSON.stringify(config);
    activateCourier(merchantId, "pathao", "active", configData).then((res) => {
      if (res.status === 200) {
        showToast("Pathao details have been successfully submitted.");
        if (router.query.redirect_from) {
          router.push("/?current_steap=panel6");
        }
      }
      stopLoading();
    });
  };

  return (
    <div className="InputField">
      <form onSubmit={handleSubmit(handlePathaoSubmit)}>
        <div className="customInput">
          <label>Pathao Client Id</label>
          <input
            type="text"
            {...register("client_id", { required: true })}
            defaultValue={decodeJson(pathaoData?.config)?.client_id}
          />
        </div>

        <div className="customInput">
          <label>Pathao Client Secret</label>
          <input
            type={showPathaoSicrets?.sicretKey ? "text" : "password"}
            {...register("client_secret", { required: true })}
            defaultValue={decodeJson(pathaoData?.config)?.client_secret}
          />
          <div
            className="eye"
            onClick={() => hanldeInputTypeChange("sicretKey")}
          >
            {showPathaoSicrets?.sicretKey ? (
              <i className="flaticon-eye"></i>
            ) : (
              <i className="flaticon-hidden"></i>
            )}
          </div>
        </div>
        <div className="customInput">
          <label>Pathao Username</label>
          <input
            type="text"
            {...register("username", { required: true })}
            defaultValue={decodeJson(pathaoData?.config)?.username}
          />
        </div>
        <div className="customInput">
          <label>Pathao Password</label>
          <input
            type={showPathaoSicrets?.password ? "text" : "password"}
            {...register("password", { required: true })}
            defaultValue={decodeJson(pathaoData?.config)?.password}
          />
          <div
            className="eye"
            onClick={() => hanldeInputTypeChange("password")}
          >
            {showPathaoSicrets?.password ? (
              <i className="flaticon-eye"></i>
            ) : (
              <i className="flaticon-hidden"></i>
            )}
          </div>
        </div>
        {/* <div className='customInput'>
                                                    <label>Grant Type</label>
                                                    <input type="text" {...register('grant_type', { required: true })} defaultValue={decodeJson(pathaoData?.config)?.grant_type} />
                                                </div> */}
        <div className="customInput">
          <label>Pathao Store ID</label>
          <input
            type="text"
            {...register("store_id", { required: true })}
            defaultValue={decodeJson(pathaoData?.config)?.store_id}
          />
        </div>
        <div className="customInput pathao">
          <label>
            Pathao Dashboard <span>&gt;</span> Developer's API <span>&gt;</span>{" "}
            Webhook Integration
          </label>
          <ul>
            <li>
              <div className="d_flex">
                <h5>
                  CallbackURL:
                  <p>
                    {" "}
                    https://web.funnelliner.com/pathao/webhook/funnelliner1234
                  </p>
                </h5>
                <CopyIcon
                  url={
                    "https://web.funnelliner.com/pathao/webhook/funnelliner1234"
                  }
                />
              </div>
            </li>
            <li>
              <div className="d_flex">
                <h5>
                  Secret:<p>funnelliner1234 </p>
                </h5>
                <CopyIcon
                  url={
                    "funnelliner1234"
                  }
                />
              </div>
            </li>
          </ul>
        </div>

        <div className="duelButton">
          <Button type="submit">Submit</Button>
          {/* <Button disabled={isLoading} type="submit">{isLoading && <i><Spinner /> </i>}Submit</Button> */}
        </div>
      </form>
    </div>
  );
};

export default Pathao;
