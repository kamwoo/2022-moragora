import commonHandler from './commonHandler';
import meetingHandler from './meetingHandler';
import eventHandler from './eventHandler';
import userHandler from './userHandler';
import meetingHandler_new from './meetingHandler_new';

const handlers = [
  ...commonHandler,
  ...meetingHandler_new,
  ...eventHandler,
  ...userHandler,
];

export default handlers;
