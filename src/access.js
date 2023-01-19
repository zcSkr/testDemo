/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState) {
  const { menuRes, getUnionuser } = initialState;
  // console.log(menuRes, 'menuRes')
  const paths = menuRes?.reduce((prev, next) => prev.concat(next).concat(next.children), []).map(item => item.path)
  return {
    accessDev: getUnionuser()?.account === 'dev',
    // BasicLayout.js 80行-87行 有请求菜单的时候用权限菜单，没有请求菜单的时候就是本地开发的时候为true
    accessRoute: (props) => paths ? paths.includes(props.path) : true,
  };
}
