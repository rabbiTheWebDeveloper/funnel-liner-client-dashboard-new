import { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { Tabs } from "../../components/ui/tabs/tabs";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import { Button } from "../../components/ui/button/button";
import { Settings } from "./settings";
import { ReportTabs } from "./_reports";
import { DashboardLayout } from "../../DashboardLayout";

export const Reports = ({ dynamic }) => {
  const router = useRouter();
  const { page } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [{ label: "Reports" }, { label: "Settings" }];

  const getInitialActiveTab = () => {
    if (!page) return 0;

    const tabIndex = tabs.findIndex(
      tab => tab.label.toLowerCase() === page?.toLowerCase()
    );
    return tabIndex >= 0 ? tabIndex : 0;
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab);

  useEffect(() => {
    if (!router.isReady) return;

    setActiveTab(getInitialActiveTab());
    setIsLoading(false);
  }, [router.isReady, page]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const newPage = tabs[newValue].label.toLowerCase();
    router.push(`/profit/${newPage}`, undefined, { shallow: true });
  };

  if (isLoading) {
    return null;
  }

  const isValidPage =
    page && tabs.some(tab => tab.label.toLowerCase() === page.toLowerCase());

  if (!isValidPage && dynamic) {
    return (
      <DashboardLayout>
        <Container>
          <div className={styles.errorContainer}>
            <h1 className={styles.errorTitle}>404</h1>
            <p className={styles.errorMessage}>Oops! Page not found</p>
            <p className={styles.errorDescription}>
              The page you are looking for might have been removed or is
              temporarily unavailable.
            </p>
            <Button onClick={() => router.push("/profit/reports")}>
              Go Back to Reports
            </Button>
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container>
        <div>
          <Tabs value={activeTab} onChange={handleTabChange} tabs={tabs}>
            <div>
              <ReportTabs />
            </div>
            <div>
              <Settings />
            </div>
          </Tabs>
        </div>
      </Container>
    </DashboardLayout>
  );
};
