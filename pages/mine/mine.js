// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.showLoading({
          title: '玩命加载中',
      });
      var that = this;
    wx.getUserInfo({
        success:function(res){
            console.log(res.userInfo);
            that.setData({
                userInfo:res.userInfo
            });
            wx.hideLoading();
        }
    })  
  },
  onClearCacheTap:function(event){
      wx.showModal({
          title: '清除缓存',
          content: '缓存清除后将不可恢复，确定要清除吗？',
          success: function (res) {
              if (res.confirm) {
                  console.log('用户点击确定');
                  wx.clearStorage();
                  wx.showToast({
                      title: '清除成功',
                  })
              } else if (res.cancel) {
                  console.log('用户点击取消');
              }
          }
      })
  }
})