import Router from 'koa-router';
import skills from './skills';
import auction from './auction';

const api = new Router();

api.use('/skills', skills.routes());
api.use('/auction', auction.routes());

export default api;
