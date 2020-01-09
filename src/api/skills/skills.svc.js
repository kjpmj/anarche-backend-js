import axios from 'axios';

const SKILL_NAMES = [
  '축산',
  '농사',
  '금속',
  '벌채',
  '채집',
  '재봉',
  '가죽',
  '목공',
  '석공',
  '손재주',
];

const getLaborDownPercent = value => {
  if (value < 30000) {
    return 0;
  } else if (value >= 30000 && value < 40000) {
    return 5;
  } else if (value >= 40000 && value < 50000) {
    return 10;
  } else if (value >= 50000 && value < 70000) {
    return 15;
  } else if (value >= 70000 && value < 150000) {
    return 20;
  } else if (value >= 150000 && value < 180000) {
    return 25;
  } else if (value >= 180000 && value < 230000) {
    return 30;
  } else if (value >= 230000) {
    return 40;
  }
};

/**
 * UUID 조회
 * @param {string} server
 * @param {string} nickname
 */
export const getUuid = async (server, nickname) => {
  const encdoedNickname = encodeURIComponent(nickname);
  const regExpStr = `(?<=data-uuid=").+(?="><strong>${nickname})`;
  const resp = await axios.get(
    `https://archeage.xlgames.com/search?dt=characters&keyword=${encdoedNickname}&subDt=&server=${server}`,
  );
  const body = resp.data.replace(/^\s+|\s+$/gm, '').replace(/\n/g, '');
  const regExp = new RegExp(regExpStr);
  const uuidArr = regExp.exec(body);

  if (!Array.isArray(uuidArr)) {
    return false;
  }

  return uuidArr[0].toLowerCase();
};

/**
 * 숙련도 조회
 * @param {string} uuid
 */
export const getSkills = async uuid => {
  const resp = await axios.get(
    `https://archeage.xlgames.com/characters/${uuid}/actabilities`,
  );
  const body = resp.data
    .replace(/^\s+|\s+$/gm, '')
    .replace(/\n/g, '')
    // eslint-disable-next-line no-useless-escape
    .replace(/<[\s\d\w\/="_<>\-\.:'%]+>/g, '');

  const skills = SKILL_NAMES.map(skillName => {
    const regExpStr = `(?<=${skillName})\\d+`;
    const regExp = new RegExp(regExpStr);
    const skillValue = parseInt(regExp.exec(body)[0]);

    return {
      skillName,
      skillValue,
      laborDownPercent: getLaborDownPercent(skillValue),
    };
  });

  return skills;
};
