import { BoxProps } from "@material-ui/core";
import React, { ReactFragment, ReactPortal, useState } from "react";
import { useRef } from "react";
import { ReactChild } from "react";
import useIsomorphicLayoutEffect from "../hooks/useIsomorphicLayoutEffect";
import Footer from "./Footer";
import NavBar from "./NavBar";
import Wrapper, { WrapperVariant } from "./Wrapper";

interface LayoutValue {
  navBarHeight: number;
  footerHeight: number;
}

interface LayoutProps extends BoxProps {
  children:
    | boolean
    | ReactChild
    | ReactFragment
    | ReactPortal
    | ((value: LayoutValue) => JSX.Element);
  variant?: WrapperVariant;
  center?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  variant,
  center,
  ...props
}) => {
  const [navBarHeight, setNavBarHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const navBarRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (navBarRef.current?.clientHeight) {
      setNavBarHeight(navBarRef.current?.clientHeight);
    }
    if (footerRef.current?.clientHeight) {
      setFooterHeight(footerRef.current?.clientHeight);
    }
  });

  return (
    <>
      <NavBar ref={navBarRef} />
      <Wrapper
        variant={variant}
        navBarHeight={navBarHeight}
        footerHeight={footerHeight}
        center={center}
        py={4}
        {...props}
      >
        {typeof children === "function"
          ? children({ navBarHeight, footerHeight })
          : children}
      </Wrapper>
      <Footer ref={footerRef} />
    </>
  );
};

export default Layout;
