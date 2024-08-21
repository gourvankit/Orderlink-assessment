import React from "react";
import styles from "./header.module.css";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
const Header = () => {
  return (
    <div className={styles.navmain}>
      <span className={styles.navheading}>Table Dynamo</span>
      <div className={styles.navpointsdiv}>
        <Avatar className={styles.avtar} sx={{ bgcolor: deepOrange[500] }}>
          GB
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
