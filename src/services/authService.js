export const getCurrentUser = () => {
  // 模拟从存储中获取当前用户信息
  return JSON.parse(localStorage.getItem('currentUser'));
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return true || user && user.role === 'Admin';
};

export const authService = {
    async login(username, password) {
      // 模拟登录
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'a' && password === 'a') {
            resolve();
          } else {
            reject();
          }
        }, 1000);
      });
    },
    register: async (username, password) => {
      // 模拟注册请求，实际项目中会发送请求到服务器
      if (username && password) {
        // 模拟一个成功的注册请求
        return Promise.resolve();
      } else {
        return Promise.reject('Registration failed');
      }
    }
  };
  