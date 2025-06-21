"use client";

import Breadcrumb from "@/components/Dashboard/BreadCrumb";
import Header from "@/components/Dashboard/Header";
import Main from "@/components/Dashboard/Main";
import NavDrawer from "@/components/Dashboard/NavDrawer";
import { DashboardProvider } from "@/context/Dashboard";
import GetMe from "@/lib/GetMe";
import { Box, Stack } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const drawerWidth = 250;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdminDashboard = pathname === "/dashboard";

  return (
    <DashboardProvider>
      <GetMe>
        <Box sx={{ display: "flex", minHeight: "100dvh", overflow: "hidden" }}>
          <Header />
          <NavDrawer />
          <Main>
            {!isAdminDashboard && <Breadcrumb />}
            <Stack
              p={{ xs: 1, sm: 2 }}
              flexGrow={1}
              height={isAdminDashboard ? "100%" : "calc(100% - 40px)"}
              overflow="auto"
            >
              {children}
            </Stack>
          </Main>
        </Box>
      </GetMe>
    </DashboardProvider>
  );
};

export default DashboardLayout;
