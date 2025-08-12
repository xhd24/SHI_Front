
import { plus } from './05-14-module.js';
console.log(plus());
window.plus2 = plus;
//모듈 js 는 윈도우 영역에 포함되어 있지 않기 때문에 button onclick에 모듈에 정의된 함수를 쓰고 싶다면
//윈도우 영역에 올려줘야함.

