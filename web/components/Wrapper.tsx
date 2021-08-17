import React, { ReactChild, ReactFragment, ReactPortal } from "react";
import { Box, Container } from "@material-ui/core";
import { BoxProps } from "@material-ui/core";

export type WrapperVariant = "md" | "sm" | "xs" | "lg" | "xl";

interface WrapperProps extends BoxProps {
  children: boolean | ReactChild | ReactFragment | ReactPortal;
  variant?: WrapperVariant;
  center?: boolean;
  navBarHeight?: number | null;
}

const Wrapper: React.VFC<WrapperProps> = ({
  children,
  variant = "md",
  center,
  navBarHeight = 0,
  ...props
}) => {
  return (
    <Box
      minHeight={`calc(100vh - ${navBarHeight}px)`}
      display="flex"
      flexDirection="column"
      justifyContent={center ? "center" : undefined}
      {...props}
    >
      <Container maxWidth={variant}>{children}</Container>
    </Box>
  );
};

export default Wrapper;
