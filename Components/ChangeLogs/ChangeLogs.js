import { Box, Container } from "@mui/material";
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";
import style from "./style.module.css";
import moment from "moment";

export const ChangeLogs = ({ releaseNotes }) => {
  return (
    <section className="DashboardSetting Changelogs">
      {/* header */}
      <HeaderDescription
        title={"Change Logs"}
        subTitle={"Discover the latest features and improvements."}
        search={false}
        order={false}
        novideo={true}
      />
      <Container maxWidth="sm">
        {
          releaseNotes?.map((item) => (
            <Box>
              <div className={style.changes} key={item._id}>
                <div className={style.heading}>
                  <span className={style.badge}>Latest - {item?.version_number}</span>
                  <h1>New features, enhancements, and bug fixes</h1>
                  <h2>
                    {moment(item?.createdAt).format('LL')} -{" "}
                    <span style={{ opacity: 0.5 }}>{moment(item?.createdAt).startOf().fromNow()}</span>
                  </h2>
                </div>
                <div className={style.changelog}>
                  <div className="boxShadow" style={{ marginTop: "1rem" }}>
                    {
                      item.features?.map((feature,) => (
                        <div key={feature._id}>
                          <h1 className={style.newfeature}>New Feature</h1>
                          {
                            feature.new_features.map((feature, index) => (
                              <Box key={feature._id}>
                                <div className={style.logs}>
                                  {/* <h1>Order Modules</h1> */}
                                  <ul>
                                    <li>
                                      <h1>{feature?.feature_name}</h1>
                                      <p>
                                        {feature?.description}
                                      </p>
                                    </li>
                                  </ul>
                                </div>
                              </Box>
                            )
                            )}
                        </div>
                      ))
                    }
                    {
                      item?.bug_fixes?.map((bug, index) => (

                        <div className={style.bug} key={bug._id}>
                          <h1 className={style.bugfixes}>Bug Fixes</h1>

                          {
                            bug?.fixed_issues?.map((bug) => (
                              <Box key={bug._id}>
                                <div className={style.logs}>
                                  {/* <h1>Order Modules</h1> */}
                                  <ul>
                                    <li>
                                      <h1>{bug.issue_name}</h1>
                                      <p>
                                       {
                                        bug?.description
                                       }
                                      </p>
                                    </li>
                                  </ul>
                                </div>
                              </Box>
                            ))
                          }
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </Box>
          ))
        }
        <div>
        </div>
      </Container>
    </section>
  );
};
