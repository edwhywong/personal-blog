import React, { forwardRef, useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/dist/client/router";
import {
  Box,
  Button,
  Link,
  List,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
  styled,
  useTheme,
  ButtonBase,
  Drawer,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { BoxProps } from "@material-ui/core";

const navItems = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const PREFIX = "Drawer";
const classes = {
  root: `${PREFIX}-root`,
};

const DrawerContainer = styled("div")(() => ({
  width: "160px",
}));

const NavBar = forwardRef<HTMLDivElement | null, BoxProps>(function NavBar(
  props,
  ref
) {
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
        justifyContent="space-around"
        flexWrap="wrap"
        paddingX={4}
        paddingY={2}
        borderBottom="1px solid #e0e0e0"
        {...props}
      >
        {isMobile && (
          <Box onClick={handleToggle}>
            <MenuIcon color="primary" />
          </Box>
        )}
        <NextLink href="/">
          <Box flex={isMobile ? 1 : undefined} textAlign="center">
            <Typography variant="h3">
              <Link href="/">E Words</Link>
            </Typography>
          </Box>
        </NextLink>
        {!isMobile && (
          <Box>
            {navItems.map((item) => (
              <NextLink key={item.label} href={item.href}>
                <Button color="primary">{item.label}</Button>
              </NextLink>
            ))}
          </Box>
        )}
        <Drawer anchor="left" open={isOpen} onClose={handleToggle}>
          <DrawerContainer
            className={classes.root}
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
          </DrawerContainer>
        </Drawer>
      </Box>
    </div>
  );
});

export default NavBar;
