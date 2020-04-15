const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  // token: state => state.user.token,

  avatar: state => state.user.avatar,
  nickname: state => state.user.name,

  roles: state => state.user.roles,

  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,

  userInfo: state => state.user.currentUser,
  token: state => state.user.token,
  department: state => state.user.currentUser.department || {},
  role: state => state.user.currentUser.role || {},
  vueBoolean: state => state.user.vueBoolean
  // userId: state => state.user.userId || {},
  // userName: state => state.user.name || {},
}

export default getters
