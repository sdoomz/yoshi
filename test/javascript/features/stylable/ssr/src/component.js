import React from 'react';
import { style, classes } from './style.st.css';

export default () => (
  <div id="stylable-div" className={style(classes.root, {})}>
    Rendered with Stylable
  </div>
);
