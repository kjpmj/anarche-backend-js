import * as svc from './auction.svc';

export const getPrice = async ctx => {
  const { server, itemname } = ctx.params;

  try {
    const itemInfo = await svc.getPrice(server, itemname);
    if (!itemInfo || !itemInfo.code) {
      ctx.status = 404;
      ctx.body = '해당 아이템의 평균 거래가를 찾을 수 없습니다.';
      return;
    }

    ctx.body = itemInfo;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getPriceTab1 = async ctx => {
  const { server, itemname } = ctx.params;

  try {
    const itemInfoList = await svc.getPriceTab1(server, itemname);

    if (itemInfoList.length === 0) {
      ctx.status = 404;
      ctx.body = [];
      return;
    }

    ctx.body = itemInfoList;
  } catch (e) {
    ctx.throw(500, e);
  }
};
