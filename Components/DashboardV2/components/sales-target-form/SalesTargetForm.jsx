import React, { useEffect } from "react";
import styles from "./sales-target-form.module.css";
import { Percent } from "lucide-react";
import { Button } from "../ui/button/button";
import { X } from "lucide-react";
import { CustomDateRangePicker } from "./CustomDateRangePicker";
import { Dialog } from "../ui/dialog/dialog";
import axios from "axios";
import { useToast } from "../../../../hook/useToast";
import { useForm } from "react-hook-form";
import { headers } from "../../../../pages/api";

function formatDateToYYYYMMDD(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export default function SalesTargetForm({ salesTarget, fetchSalesTarget }) {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({
    startDate: salesTarget?.from_date ? new Date(salesTarget.from_date) : null,
    endDate: salesTarget?.to_date ? new Date(salesTarget.to_date) : null,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const showToast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      daily: salesTarget?.daily || "",
      monthly: salesTarget?.monthly || "",
      custom: salesTarget?.custom || "",
    },
  });

  useEffect(() => {
    // Reset form with salesTarget values on open
    reset({
      daily: salesTarget?.daily || "",
      monthly: salesTarget?.monthly || "",
      custom: salesTarget?.custom || "",
    });

    // Set date range
    setDateRange({
      startDate: salesTarget?.from_date ? new Date(salesTarget.from_date) : null,
      endDate: salesTarget?.to_date ? new Date(salesTarget.to_date) : null,
    });
  }, [salesTarget, reset]);

  const onSubmit = (data) => {
    data.daily = parseInt(data.daily) > 0 ? data.daily : 0;
    data.monthly = parseInt(data.monthly) > 0 ? data.monthly : 0;
    data.custom = parseInt(data.custom) > 0 ? data.custom : 0;
    data.from_date = dateRange.startDate ? formatDateToYYYYMMDD(dateRange.startDate) : null;
    data.to_date = dateRange.endDate ? formatDateToYYYYMMDD(dateRange.endDate) : null;

    axios.post(process.env.NEXT_PUBLIC_API_URL + "/client/sales-target/update", data, {
      headers: headers,
    })
    .then(function (response) {
      fetchSalesTarget();
      showToast("Sales Target updated successfully!", "success");
    })
    .catch(function (error) {
      showToast("Failed to update sales target.", "error");
    });
    reset();
    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen}>Update Sales Target</Button>

      <Dialog open={open} onClose={handleClose}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <span className={styles.icon}>
              <Percent />
            </span>
            <h2 className={styles.title}>Update Sales Target in BDT</h2>
            <button className={styles.closeButton} onClick={handleClose}>
              <X />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
              <label htmlFor="daily-target" className={styles.label}>
                Enter Daily Sales Target <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="daily"
                name="daily"
                placeholder="5"
                className={styles.input}
                {...register("daily", { required: true })}
              />
              {errors.daily && <p className="error">This field is required</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="monthly-target" className={styles.label}>
                Enter Monthly Sales Target <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="monthly"
                name="monthly"
                placeholder="5"
                className={styles.input}
                {...register("monthly", { required: true })}
              />
              {errors.monthly && <p className="error">This field is required</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="custom-target" className={styles.label}>
                Enter Custom Sales Target <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="custom"
                name="custom"
                placeholder="5"
                className={styles.input}
                {...register("custom", { required: true })}
              />
              {errors.custom && <p className="error">This field is required</p>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Choose Your Custom Targeting Date Range
              </label>
              <div className={styles.dateRange}>
                <div className={styles.dateInput}>
                  <label className={styles.dateLabel}>From</label>
                  <CustomDateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Select start date"
                    type="from"
                  />
                </div>
                <div className={styles.dateInput}>
                  <label className={styles.dateLabel}>To</label>
                  <CustomDateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Select end date"
                    type="to"
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className={styles.submitButton}>
              Save Changes
            </Button>
          </form>
        </div>
      </Dialog>
    </>
  );
}
