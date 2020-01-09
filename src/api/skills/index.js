import Router from 'koa-router';
import * as ctrl from './skills.ctrl';

const skills = new Router();

skills.get('/:server/:nickname', ctrl.getSkills);

export default skills;
