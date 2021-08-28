import {
  Typography,
  Link,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import React from "react";

export interface CareerBoxProps {
  title: string;
  companyName: string;
  companyWebsite: string;
  workingPeriod: string;
  duties: string[];
}

const CareerBox: React.VFC<CareerBoxProps> = ({
  title,
  companyName,
  companyWebsite,
  workingPeriod,
  duties,
}) => {
  return (
    <Box>
      <Typography variant="h6" component="span">
        {title}
      </Typography>
      <Typography variant="h6" component="span" color="primary">
        &nbsp;@&nbsp;
      </Typography>
      <Typography variant="h6" component="span">
        <Link
          sx={{
            textDecoration: "none",
            ":hover": { textDecoration: "underline" },
          }}
          href={companyWebsite}
          target="_blank"
        >
          {companyName}
        </Link>
      </Typography>
      <Typography variant="caption" component="p">
        {workingPeriod}
      </Typography>
      <List>
        {duties.map((duty, idx) => (
          <ListItem key={`${companyName}-duty-${idx}`} sx={{ p: 0 }}>
            <ListItemIcon sx={{ minWidth: "2rem" }}>
              <ArrowRightIcon />
            </ListItemIcon>
            <ListItemText primary={duty} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CareerBox;
