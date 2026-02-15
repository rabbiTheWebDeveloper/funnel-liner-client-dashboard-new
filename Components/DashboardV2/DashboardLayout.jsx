import styles from "./global.module.css";
import { propagateVariablesToRoot } from "./lib/utils";
export const DashboardLayout = ({ children }) => {
  return (
    <main
      ref={el => el && propagateVariablesToRoot(el)}
      className={styles.global + " WebsiteLink"}
    >
      {children}
    </main>
  );
};
