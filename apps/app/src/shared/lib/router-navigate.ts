type RouterNavigateFn = (to: string) => void;

let _routerNavigate: RouterNavigateFn = () => {};

export const setRouterNavigate = (fn: RouterNavigateFn) => {
  _routerNavigate = fn;
};
export const routerNavigate: RouterNavigateFn = (to) => _routerNavigate(to);
