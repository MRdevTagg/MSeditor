const $ = sel => document.querySelector(sel)
const $$ = sel => document.querySelectorAll(sel)
const a$ = (sel) => Array.from($$(sel))

const Style = (el,style) => window.getComputedStyle(el,null).getPropertyValue(style)
