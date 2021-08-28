import {
  Box,
  Chip,
  Fade,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Image from "next/image";
import React, { useState } from "react";
import CareerBox from "../components/CareerBox";
import Layout from "../components/Layout";
import profilePic from "../public/me.jpeg";
import VisibilitySensor from "react-visibility-sensor";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box px={3} py={1}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabIdx, setTabIdx] = useState(0);
  const [aboutIn, setAboutIn] = useState(false);
  const [workIn, setWorkIn] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIdx(newValue);
  };

  const handleAboutSessionSensor = (isVisible: boolean) => {
    if (!aboutIn && isVisible) {
      setAboutIn(isVisible);
    }
  };

  const handleWorkSessionSensor = (isVisible: boolean) => {
    if (!workIn && isVisible) {
      setWorkIn(isVisible);
    }
  };

  return (
    <Layout pt={0}>
      {({ navBarHeight }) => (
        <>
          <Box
            minHeight={`calc(100vh - ${navBarHeight}px)`}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box marginTop={`-${navBarHeight}px`}>
              <Fade in={true} timeout={1000}>
                <Typography variant="h6" color="primary">
                  Hello world, I&apos;m
                </Typography>
              </Fade>
              <Fade in={true} timeout={2000}>
                <Typography
                  variant={isMobile ? "h3" : "h1"}
                  color="secondary"
                  className="text-fall"
                >
                  Edward Wong.
                </Typography>
              </Fade>
              <Fade in={true} timeout={3000}>
                <Typography variant="body2" mt={2}>
                  <br />
                  Here, you will find my thoughts about software development.
                </Typography>
              </Fade>
            </Box>
          </Box>
          <VisibilitySensor
            partialVisibility
            onChange={handleAboutSessionSensor}
          >
            <Box minHeight={`calc(75vh - ${navBarHeight}px)`}>
              <Fade in={aboutIn} timeout={1000}>
                <Box>
                  <Typography
                    variant="h4"
                    component="span"
                    color="primary"
                    fontWeight="200"
                  >
                    01.
                  </Typography>
                  <Typography variant="h4" component="span" fontWeight="200">
                    &nbsp;About Me
                  </Typography>
                  <Grid container>
                    <Grid xs={12} sm={8} pr={2} item>
                      <Typography variant="body2" mt={2}>
                        Hi! I&apos;m Edward, a software engineer from Hong Kong,
                        currently living in Toronto, who enjoy coding and
                        problem solving.
                        <br />
                        <br />
                        I have experience in developing both frontend and
                        backend for web and mobile applications. I&apos;m
                        dedicated to write scalable, reliable code base as a
                        solution that satisfied clients&apos; needs.
                        <br />
                        <br />
                        Below are somes technologies I&apos;ve been working on
                        lately:
                      </Typography>

                      <Stack spacing={2} my={4}>
                        <Stack direction="row" spacing={2}>
                          <Chip
                            label="Javascript (ES6+)"
                            sx={{ borderColor: "#f7df1e" }}
                            variant="outlined"
                          />
                          <Chip
                            label="Typescript"
                            sx={{ borderColor: "#3178c6", color: "#3178c6" }}
                            variant="outlined"
                          />
                          <Chip label="Java" color="error" variant="outlined" />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                          <Chip
                            label="React"
                            sx={{ borderColor: "#61dafb", color: "#0b95bb" }}
                            variant="outlined"
                          />
                          <Chip
                            label="React Native"
                            sx={{ borderColor: "#61dafb", color: "#0b95bb" }}
                            variant="outlined"
                          />
                          <Chip
                            label="Redux"
                            sx={{ borderColor: "#9c27b0", color: "#9c27b0" }}
                            variant="outlined"
                          />
                          <Chip
                            label="Node.js"
                            color="success"
                            variant="outlined"
                          />
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid xs={12} sm={4} mb={4} item>
                      <Image
                        src={profilePic}
                        alt="Picture of the author"
                        className="avatar"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Box>
          </VisibilitySensor>
          <VisibilitySensor
            partialVisibility
            onChange={handleWorkSessionSensor}
          >
            <Box minHeight={`calc(75vh - ${navBarHeight}px)`} mt={8}>
              <Fade in={workIn} timeout={1000}>
                <Box>
                  <Typography
                    variant="h4"
                    component="span"
                    color="primary"
                    fontWeight="200"
                  >
                    02.
                  </Typography>
                  <Typography variant="h4" component="span" fontWeight="200">
                    &nbsp;Where I&apos;ve Worked
                  </Typography>
                  <Box
                    mt={2}
                    display="flex"
                    flexDirection={isMobile ? "column" : "row"}
                  >
                    <Tabs
                      orientation={isMobile ? "horizontal" : "vertical"}
                      variant="scrollable"
                      value={tabIdx}
                      onChange={handleChange}
                      aria-label="Vertical tabs example"
                      sx={{
                        [isMobile ? "borderBottom" : "borderRight"]: 1,
                        borderColor: "divider",
                        maxWidth: isMobile ? undefined : "145px",
                      }}
                    >
                      <Tab label="Arch Partnership" {...a11yProps(0)} />
                      <Tab label="CISC" {...a11yProps(1)} />
                      <Tab label="PCCW" {...a11yProps(2)} />
                    </Tabs>
                    <TabPanel value={tabIdx} index={0}>
                      <CareerBox
                        title="Senior Analyst Programmer"
                        companyName="Arch Partnership"
                        companyWebsite="https://www.arch-partnership.com/"
                        workingPeriod="Aug 2019 - Sep 2021"
                        duties={[
                          "Designed and implmented insurance e-submission mobile app to facilitate insurance selling process",
                          "Developed Web application for insurance product and proposal comparison",
                          "Work closely with UI/UX, backend and business team in agile environment to deliver user-oriented solutions",
                        ]}
                      />
                    </TabPanel>
                    <TabPanel value={tabIdx} index={1}>
                      <CareerBox
                        title="Software Engineer"
                        companyName="CISC"
                        companyWebsite="https://www.ciscltd.hk/"
                        workingPeriod="Aug 2018 - Aug 2019"
                        duties={[
                          "Developed Web Application for searching websites information, including search by text/image",
                          "Developed crawler, health check and miscellaneous modules to enlarge search coverage and accuracy",
                          "Optimised search result and speed",
                        ]}
                      />
                    </TabPanel>
                    <TabPanel value={tabIdx} index={2}>
                      <CareerBox
                        title="Solution Developer"
                        companyName="PCCW Solutions"
                        companyWebsite="https://www.pccwsolutions.com/"
                        workingPeriod="Aug 2016 - Sep 2018"
                        duties={[
                          "Developed web application for pay-tv service subscriptions",
                          "Prepared backend batch jobs to handle large numbers of subscriptions",
                          "Gathered and analysed requirements from different parties",
                        ]}
                      />
                    </TabPanel>
                  </Box>
                </Box>
              </Fade>
            </Box>
          </VisibilitySensor>
        </>
      )}
    </Layout>
  );
};

export default About;
