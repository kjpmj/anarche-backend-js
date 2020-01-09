import * as svc from './skills.svc';

/**
 * 숙련도 조회
 * GET /api/skills/:server/:nickname
 * @param {*} ctx
 */
export const getSkills = async ctx => {
  const { server, nickname } = ctx.params;

  try {
    const uuid = await svc.getUuid(server, nickname);
    if (!uuid) {
      ctx.status = 404;
      ctx.body = '일치하는 캐릭터가 없습니다.';
      return;
    }

    const skills = await svc.getSkills(uuid);
    ctx.body = skills;
  } catch (e) {
    ctx.throw(500, e);
  }
};
