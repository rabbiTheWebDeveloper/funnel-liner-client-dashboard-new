import { TabContext, TabList } from "@mui/lab";
import { Box, Button, Container, Grid, Tab } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";
import { setActiveTab } from "../../redux/features/dropDownSlice/dropdownSlice";
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";
import BussnessInfo from "./BussnessInfo";

const DashboardSetting = ({ response }) => {
  const activeTab = useSelector(state => state.dropDown.activeTab);
  const router = useRouter();
  const redirectFrom = router.query.redirect_from;
  const showToast = useToast();
  const [user, setUser] = useState(null);
  const [ownInfo, setOwnInfo] = useState({});
  const [value, setValue] = useState("1");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const userList = Cookies.get("user");
    setUser(JSON.parse(userList));
  }, []);

  useEffect(() => {
    if (router?.query?.pass !== undefined) {
      handleChangeTab(0, router?.query?.pass);
    }
  }, []);

  const ownInfoSubmit = data => {
    axios
      .post(
        process.env.NEXT_PUBLIC_API_URL + "/client/settings/owner-info/update",
        data,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        showToast("Owner information has been successfully updated");
      })
      .catch(function (error) {
        showToast("Something went wrong!", "error");
      });
  };

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/settings/owner-info", {
        headers: headers,
      })
      .then(function (response) {
        let target = response.data.data;
        setOwnInfo(target);
      });
  }, []);

  const passwordSubmit = data => {
    if (data.new_password !== data.password_confirmation) {
      showToast("The Confirm password confirmation does not match", "error");
    }
    if (data.new_password === data.password_confirmation) {
      axios
        .post(
          process.env.NEXT_PUBLIC_API_URL +
            "/client/settings/password-security/update",
          data,
          { headers: headers }
        )
        .then(function (response) {
          showToast(response?.data?.msg);
          reset();
        })
        .catch(function (error) {
          showToast(error?.response?.data?.msg, "error");
        });
    }
  };

  //
  const dispatch = useDispatch();
  const handleTabChnage = value => {
    dispatch(setActiveTab(value));
  };

  return (
    <>
      <section className="TopSellingProducts DashboardSetting">
        <HeaderDescription
          headerIcon={"flaticon-settings-2"}
          title={"Settings"}
          subTitle={"Update your shop info and other settings here"}
          search={false}
          order={false}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs boxShadow">
            <Box>
              <TabContext value={activeTab}>
                <Box className="CommonTab">
                  <TabList
                    onChange={handleChangeTab}
                    aria-label="lab API tabs example"
                  >
                    <Tab
                      onClick={() => handleTabChnage("1")}
                      label="Business Information"
                      value="1"
                    />
                    <Tab
                      onClick={() => handleTabChnage("2")}
                      label="Owner Information"
                      value="2"
                    />
                    <Tab
                      onClick={() => handleTabChnage("3")}
                      label="Password & Security"
                      value="3"
                    />
                  </TabList>
                </Box>

                {activeTab == 1 && (
                  <div className="DashboardSettingItem">
                    <BussnessInfo
                      redirectFrom={redirectFrom}
                      response={response}
                    ></BussnessInfo>
                  </div>
                )}
                {activeTab == 2 && (
                  <div className="DashboardTabsItem">
                    <div className="DashboardForm">
                      <div className="DashboardFormItem">
                        <Grid container spacing={3}>
                          <Grid item md={12}>
                            <div className="left">
                              <h4>Update Owner Information</h4>
                              <p>Update your shop info and other settings</p>
                            </div>
                          </Grid>

                          <Grid item xs={12} md={12}>
                            <form onSubmit={handleSubmit(ownInfoSubmit)}>
                              <div className="customInput">
                                <label>
                                  Owner Name <span>*</span>
                                </label>
                                <input
                                  type="text"
                                  defaultValue={ownInfo.owner_name}
                                  {...register("owner_name")}
                                  required
                                />
                              </div>

                              <div className="customInput">
                                <label>
                                  Contact Number <span>*</span>
                                </label>
                                <input
                                  type="number"
                                   InputProps={{ readOnly: true }}
                                  defaultValue={ownInfo?.owner_number}
                                  {...register("owner_number")}
                                  required
                                  disabled
                                 
                                />
                              </div>

                              <div className="customInput">
                                <label>
                                  Email Address <span>*</span>
                                </label>
                                <input
                                  type="text"
                                  InputProps={{ readOnly: true }}
                                  value={ownInfo?.owner_email}
                                  {...register("owner_email")}
                                  required
                                />
                              </div>

                              <div className="customInput">
                                <label>Address</label>
                                <input
                                  type="text"
                                  defaultValue={ownInfo?.owner_address}
                                  {...register("owner_address")}
                                />
                              </div>

                              <div className="customInput">
                                <label>Other Information</label>
                                <input
                                  type="text"
                                  defaultValue={ownInfo?.owner_other_info}
                                  {...register("owner_other_info")}
                                />
                              </div>

                              <div className="duelButton">
                                <Button type="submit">Update</Button>
                              </div>
                            </form>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab == 3 && (
                  <div className="DashboardTabsItem">
                    <div className="DashboardForm">
                      <div className="DashboardFormItem">
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12}>
                            <div className="left">
                              <h5>Update Password</h5>
                              <p>Password for your profile Login</p>
                            </div>
                          </Grid>

                          <Grid item xs={12} md={12}>
                            <form onSubmit={handleSubmit(passwordSubmit)}>
                              <div className="customInput">
                                <label>Current Password</label>
                                <input
                                  type="text"
                                  placeholder="Current Password"
                                  {...register("old_password", {
                                    required: true,
                                  })}
                                />
                                {errors.old_password && (
                                  <p className="error">
                                    Old Password is required
                                  </p>
                                )}
                              </div>

                              <div className="customInput">
                                <label>New Password</label>
                                <input
                                  type="password"
                                  placeholder="New Password"
                                  {...register("new_password", {
                                    required: true,
                                    minLength: 7,
                                  })}
                                />
                                {errors.new_password && (
                                  <p className="error">
                                    The Password filed must be at least 7
                                    characters
                                  </p>
                                )}
                              </div>

                              <div className="customInput">
                                <label>Confirm New Password</label>
                                <input
                                  type="password"
                                  placeholder="Confirm New Password"
                                  {...register("password_confirmation", {
                                    required: true,
                                    minLength: 7,
                                  })}
                                />
                                {errors.password_confirmation && (
                                  <p className="error">
                                    Confirmation Password is required
                                  </p>
                                )}
                              </div>

                              <div className="duelButton">
                                <Button type="submit">Update</Button>
                              </div>
                            </form>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </div>
                )}
              </TabContext>
            </Box>
          </div>
        </Container>
      </section>
    </>
  );
};

export default DashboardSetting;
