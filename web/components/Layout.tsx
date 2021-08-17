import React, { ReactFragment, ReactPortal, useState } from "react";
import { useRef } from "react";
import { ReactChild } from "react";
import useIsomorphicLayoutEffect from "../hooks/useIsomorphicLayoutEffect";
import NavBar from "./NavBar";
import Wrapper, { WrapperVariant } from "./Wrapper";

interface LayoutProps {
  children: boolean | ReactChild | ReactFragment | ReactPortal;
  variant?: WrapperVariant;
  center?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, variant, center }) => {
  const [navBarHeight, setNavBarHeight] = useState(0);
  const navBarRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (navBarRef.current?.clientHeight) {
      setNavBarHeight(navBarRef.current?.clientHeight);
    }
  });

  return (
    <>
      <NavBar ref={navBarRef} />
      <Wrapper
        variant={variant}
        navBarHeight={navBarHeight}
        center={center}
        py={4}
      >
        {children}
      </Wrapper>
    </>
  );
};

export default Layout;
