import { app } from 'electron';
import os from 'os';

type Template = {
  to: string;
  subject: string;
  body: string;
};

export const BUG_REPORT: Template = {
  to: encodeURI('supercontrollerhelp@gmail.com'),
  subject: encodeURI('Bug Report'),
  body: encodeURI(`Bug Report: ${new Date().toLocaleString()}
Platform: ${os.version()}
Mimic Version: ${app.getVersion()}

~~~ In as much detail as possible, please describe the steps required to reproduce this bug ~~~


~~~ What should have happened, but didn't? ~~~


~~~ Please include any relevant screenshots below ~~~


Thanks!`),
};

export const FEATURE_REQUEST: Template = {
  to: encodeURI('supercontrollerhelp@gmail.com'),
  subject: encodeURI('Feature Request'),
  body: encodeURI(`~~~ What feature would you like added to Mimic? ~~~

`),
};
