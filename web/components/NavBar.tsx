import React, { forwardRef, useEffect, useState } from "react";
import NextLink from "next/link";
import { useIsLogin } from "../hooks/useIsLogin";
import { ACCESS_TOKEN_KEY } from "../constants";
import { useRouter } from "next/dist/client/router";
import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  makeStyles,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const navItems = [
  {
    label: "About",
    href: "/about",
  },
];

const useStyle = makeStyles((theme) => ({
  drawer: {
    width: "160px",
  },
}));

const NavBar = forwardRef<HTMLDivElement | null, {}>(function NavBar(
  _props,
  ref
) {
  const classes = useStyle();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen((open) => !open);
  };

  return (
    <div ref={ref}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        paddingX={4}
        paddingY={2}
        borderBottom="1px solid #e0e0e0"
      >
        <Typography variant="h3">E Words</Typography>
        {!isMobile && (
          <Box>
            {navItems.map((item) => (
              <NextLink key={item.label} href={item.href}>
                <Link>{item.label}</Link>
              </NextLink>
            ))}
          </Box>
        )}
        {isMobile && (
          <Box onClick={handleToggle}>
            <MenuIcon color="primary" />
          </Box>
        )}
        <SwipeableDrawer
          anchor="left"
          open={isOpen}
          onClose={handleToggle}
          onOpen={handleToggle}
        >
          <div
            className={classes.drawer}
            role="presentation"
            onClick={handleToggle}
            onKeyDown={handleToggle}
          >
            <List>
              {navItems.map((item) => (
                <NextLink key={item.label} href={item.href}>
                  <Button fullWidth color="primary">
                    {item.label}
                  </Button>
                </NextLink>
              ))}
            </List>
          </div>
        </SwipeableDrawer>
      </Box>
    </div>
  );
});

export default NavBar;
