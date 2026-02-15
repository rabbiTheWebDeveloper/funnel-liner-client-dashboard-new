import * as React from "react";
import { useForm } from "react-hook-form";
import style from "./style.module.css";
import { Button } from "@mui/material";
import { headers, shopId } from "../../pages/api";
import axios from "axios";
import { useToast } from "../../hook/useToast";
import { domainRegex } from "../../constant/constant";

export const DomainEdit = ({ defaultValue, shopName }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  React.useEffect(() => {
    setValue("domain_request", defaultValue);
  }, [defaultValue, setValue]);

  const onSubmit = data => {
    const toast = useToast();
    if (!domainRegex.test(data.domain_request)) {
      // or shopName if defined elsewhere
      toast("Please enter a valid domain name.", "error");
      return;
    }

    data.shop_name = shopName;
    data.shop_id = shopId;
    data.domain_status = "pending";

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/settings/domain/update`,
        data,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        toast(response.data.msg);
      })
      .catch(function (error) {
        toast(
          error.response?.data?.msg ||
            "Oops! Something went wrong. Please try again later or contact support."
        );
      });

    reset();
  };

  return (
    <div className={style.domainEdit}>
      <form onSubmit={handleSubmit(onSubmit)} className={style.DomainInput}>
        <div className={style.domainInput}>
          <h1>Domain</h1>
          <div className={style.addDomainInput}>
            <input
              aria-label="Domain Alias"
              placeholder="mywebsite.com"
              aria-invalid="false"
              autocapitalize="none"
              autocomplete="off"
              autocorrect="off"
              data-geist-input=""
              spellcheck="false"
              type="text"
              {...register("domain_request", { required: true })}
              className={style.inputField}
            />
          </div>
        </div>

        <div className={style.domainActions}>
          <Button
            variant="outlined"
            type="button"
            className={`${style.addDomainButton} ${style.domainActionRemove}`}
            onClick={() => setValue("domain_request", "")}
          >
            Clear
          </Button>

          <Button
            variant="contained"
            type="submit"
            className={style.addDomainButton}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
