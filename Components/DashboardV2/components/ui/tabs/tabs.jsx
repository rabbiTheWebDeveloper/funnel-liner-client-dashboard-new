import * as React from "react";
import { Tabs as MuiTabs, Tab as MuiTab, Box } from "@mui/material";
import styles from "./tabs.module.css";
import { cls } from "../../../lib/utils";

const tabsVariants = ({
  variant = "default",
  size = "default",
  className = "",
}) => {
  const baseClasses = styles.tabs;
  const variantClasses = styles[variant] || "";
  const sizeClasses = styles[size] || "";

  return cls(baseClasses, variantClasses, sizeClasses, className);
};

const TabPanel = ({ children, value, index, ...props }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className={styles.tabPanel}
      {...props}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const Tabs = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      value,
      onChange,
      children,
      tabs,
      ...props
    },
    ref
  ) => {
    return (
      <div className={styles.tabsWrapper}>
        <MuiTabs
          ref={ref}
          value={value}
          onChange={onChange}
          className={tabsVariants({ variant, size, className })}
          TabIndicatorProps={{
            className: styles.tabIndicator,
          }}
          {...props}
        >
          {tabs.map((tab, index) => (
            <MuiTab
              key={index}
              label={tab.label}
              className={styles.tab}
              classes={{
                root: styles.tabRoot,
              }}
              {...tab.props}
            />
          ))}
        </MuiTabs>
        {React.Children.map(children, (child, index) => (
          <TabPanel value={value} index={index}>
            {child}
          </TabPanel>
        ))}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

export { Tabs, tabsVariants, TabPanel };
