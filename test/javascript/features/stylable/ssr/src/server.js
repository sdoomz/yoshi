import ejs from 'ejs';
import React from 'react';
import ReactDomServer from 'react-dom/server';

import express from 'express';
import Component from './component';

const app = express();

app.get('/', async (req, res) => {
  const html = await ReactDomServer.renderToString(<Component />);
  res.send(await ejs.renderFile('./src/index.ejs', { html }));
});

app.listen(process.env.PORT);
