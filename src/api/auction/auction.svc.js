/* eslint-disable no-case-declarations */
import axios from 'axios';
import qs from 'querystring';

const listUrl = 'https://archeage.xlgames.com/auctions/list/ajax';
const frontUrl = 'https://archeage.xlgames.com/auctions/record/';
const backUrl = '/ajax?callback=getPriceCallBack';

const regExpItemCode = /(?<=data-id=")\d+/;
const regExpItemGrade = /(?<=data-grade=")\d+/;
const regExpBronze = /\d{1,2}$/;
const regExpSilver = /\d{1,2}(?=\d{2}$)/;
const regExpGold = /\d+(?=\d{4}$)/;

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

export const getPrice = async (server, itemname) => {
  const reqListBody = {
    sortType: 'BUYOUT_PRICE_ASC',
    searchType: 'NAME',
    serverCode: server,
    keywordStr: itemname,
    equalKeyword: true,
    keyword: itemname,
  };

  const reqDetailBody = {
    serverCode: server,
  };

  // eslint-disable-next-line no-unused-vars
  const getPriceCallBack = itemPriceInfo => {
    const todayPriceInfo = itemPriceInfo.records
      .reverse()
      .find(recode => recode.count > 0);

    if (!todayPriceInfo) {
      return;
    }

    let itemInfo = {
      code: '',
      grade: '',
      name: itemname,
      gold: 0,
      silver: 0,
      bronze: 0,
      price: 0,
      baseDate: '',
    };

    itemInfo.baseDate = itemPriceInfo.baseDate;

    const bronze = Array.isArray(regExpBronze.exec(todayPriceInfo.avr))
      ? (itemInfo.bronze = parseInt(regExpBronze.exec(todayPriceInfo.avr)[0]))
      : 0;
    const silver = Array.isArray(regExpSilver.exec(todayPriceInfo.avr))
      ? (itemInfo.silver = parseInt(regExpSilver.exec(todayPriceInfo.avr)[0]))
      : 0;
    const gold = Array.isArray(regExpGold.exec(todayPriceInfo.avr))
      ? (itemInfo.gold = parseInt(regExpGold.exec(todayPriceInfo.avr)[0]))
      : 0;

    itemInfo.gold = gold;
    itemInfo.silver = silver;
    itemInfo.bronze = bronze;

    itemInfo.price = (gold + silver / 100 + bronze / 10000).toFixed(4);

    return itemInfo;
  };

  const resp = await axios.post(listUrl, qs.stringify(reqListBody), config);
  const body = resp.data.replace(/^\s+|\s+$/gm, '').replace(/\n/g, '');
  const itemCodeArr = regExpItemCode.exec(body);
  const itemGradeArr = regExpItemGrade.exec(body);

  if (Array.isArray(itemCodeArr) && Array.isArray(itemGradeArr)) {
    const detailUrl = `${frontUrl} ${itemCodeArr[0]}/${itemGradeArr[0]} ${backUrl}`;
    const resp = await axios.post(
      detailUrl,
      qs.stringify(reqDetailBody),
      config,
    );

    const itemInfo = eval(resp.data);

    if (!itemInfo) {
      return;
    }

    itemInfo.code = itemCodeArr[0];
    itemInfo.grade = itemGradeArr[0];

    return itemInfo;
  }
};

export const getPriceTab1 = async (server, itemname) => {
  try {
    switch (itemname) {
      case '철 주괴':
        return [
          await getPrice(server, itemname),
          await getPrice(server, '철광석'),
        ];
      case '목재':
        return [
          await getPrice(server, itemname),
          await getPrice(server, '통나무'),
        ];
      case '석재':
        return [
          await getPrice(server, itemname),
          await getPrice(server, '암석'),
        ];
      case '가죽':
        return [
          await getPrice(server, itemname),
          await getPrice(server, '생가죽'),
        ];
      case '옷감':
        return [
          await getPrice(server, itemname),
          await getPrice(server, '양털'),
          await getPrice(server, '목화솜'),
        ];
      default:
        return [];
    }
  } catch (e) {
    return [];
  }
};

export const getPriceTab2 = async (server, itemname) => {
  try {
    switch (itemname) {
      case '손질된 고기':
        return [
          await getPrice(server, itemname),
          await getPrice(server, '생가죽'),
        ];
      default:
        return [];
    }
  } catch (e) {
    return [];
  }
};
