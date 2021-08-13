import React, {
  ReactFragment,
  ReactPortal,
  useLayoutEffect,
  useState,
} from "react";
import { useRef } from "react";
import { ReactChild } from "react";
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

  useLayoutEffect(() => {
    if (navBarRef.current?.clientHeight) {
      setNavBarHeight(navBarRef.current?.clientHeight);
    }
  }, []);

  return (
    <>
      <NavBar ref={navBarRef} />
      <Wrapper variant={variant} navBarHeight={navBarHeight} center={center}>
        {children}
      </Wrapper>
    </>
  );
};

export default Layout;
