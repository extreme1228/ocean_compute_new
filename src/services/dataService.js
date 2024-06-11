export const dataService = {
    async getLatestData() {
      // 模拟获取数据
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            temperature: 20,
            salinity: 35
          });
        }, 1000);
      });
    }
  };
  