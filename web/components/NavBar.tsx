import {
  Box,
  BoxProps,
  Button,
  Drawer,
  Link,
  List,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NextLink from "next/link";
import React, { forwardRef, useState } from "react";

const navItems = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Blog",
    href: "/",
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
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen((open) => !open);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-around"
      flexWrap="wrap"
      paddingX={4}
      paddingY={2}
      borderBottom="1px solid #e0e0e0"
      ref={ref}
      {...props}
    >
      {isMobile && (
        <Box onClick={handleToggle}>
          <MenuIcon color="primary" />
        </Box>
      )}
      <NextLink href="/">
        <Box flex={isMobile ? 1 : undefined} textAlign="center">
          <Typography variant="h3" fontWeight={200}>
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
  );
});

export default NavBar;
