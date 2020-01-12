import Router from 'koa-router';
import * as ctrl from './auction.ctrl';

const auction = new Router();

auction.get('/price/:server/:itemname', ctrl.getPrice);
auction.get('/tab1/:server/:itemname', ctrl.getPriceTab1);
auction.get('/tab2/:server/:itemname', ctrl.getPriceTab2);

export default auction;
