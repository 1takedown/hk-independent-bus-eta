import {
  Box,
  SxProps,
  Theme,
  Container,
  CssBaseline,
  Link,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import GACookieConsent from "./GACookieConsent";
import CollectionDrawer from "./CollectionDrawer";
import CollectionDialog from "./collections/CollectionDialog";
import { Suspense, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import PinDialog from "./PinDialog";

const isStandaloneApp = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const Root = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const isIosStandalone = isStandaloneApp();

  // Keep the document language in sync with the UI language so screen
  // readers announce content with the correct voice / pronunciation.
  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant";
  }, [language]);

  return (
    <Container maxWidth="xs" disableGutters sx={rootSx}>
      <CssBaseline />
      {isIosStandalone &&
        createPortal(<Box aria-hidden="true" sx={safeAreaSx} />, document.body)}
      <Link href="#main-content" sx={skipLinkSx}>
        {t("跳至主要內容")}
      </Link>
      <Header />
      <Suspense fallback={null}>
        <Box component="main" id="main-content" sx={mainSx}>
          <GACookieConsent />
          <Outlet />
        </Box>
      </Suspense>
      <Footer />
      <CollectionDrawer />
      <CollectionDialog />
      <PinDialog />
    </Container>
  );
};

const rootSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
};

// iOS 27 draws a system blur over the top of a home-screen app unless a
// painted fixed element sits within 4px of the top, is at least 6px tall,
// and covers most of the width. safe-area-inset-top is 0 in some layouts.
const safeAreaSx: SxProps<Theme> = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "max(11px, env(safe-area-inset-top, 0px))",
  backgroundColor: (theme) => theme.palette.background.default,
  zIndex: (theme) => theme.zIndex.appBar,
  pointerEvents: "none",
};

// Visually hidden until it receives keyboard focus, then shown on top so
// keyboard / screen-reader users can jump straight to the content.
const skipLinkSx: SxProps<Theme> = {
  ...visuallyHidden,
  "&:focus": {
    position: "fixed",
    top: 8,
    left: 8,
    width: "auto",
    height: "auto",
    clip: "auto",
    zIndex: (theme) => theme.zIndex.tooltip + 1,
    p: 1,
    backgroundColor: (theme) => theme.palette.background.paper,
    color: (theme) => theme.palette.text.primary,
    borderRadius: 1,
  },
};

const mainSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflow: "hidden",
  backgroundColor: (theme) => theme.palette.background.default,
};

export default Root;
