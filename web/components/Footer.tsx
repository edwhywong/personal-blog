import { IconButton, Box, BoxProps } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import EmailIcon from "@material-ui/icons/Email";
import React, { forwardRef } from "react";

const Footer = forwardRef<HTMLDivElement | null, BoxProps>(function Footer(
  props,
  ref
) {
  return (
    <Box mt="auto" display="flex" justifyContent="center" ref={ref} py={2} {...props}>
      <IconButton
        aria-label="github"
        sx={{ ":hover": { color: "#000000" } }}
        href="https://github.com/edwhywong"
        target="_blank"
      >
        <GitHubIcon />
      </IconButton>
      <IconButton
        aria-label="linkedIn"
        sx={{ ":hover": { color: "#0a66c2" } }}
        href="https://www.linkedin.com/in/edward-wong-2869091b9/"
        target="_blank"
      >
        <LinkedInIcon />
      </IconButton>
      <IconButton aria-label="email" href="mailto:ed.wong.2128@gmail.com">
        <EmailIcon />
      </IconButton>
    </Box>
  );
});

export default Footer;
