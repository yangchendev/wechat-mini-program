var postDatas = require("../../data/posts-data.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("onLoad");

        this.setData({
            postList:postDatas.postList
        });
    },
    onPostTap:function(event){
        var postId = event.currentTarget.dataset.postid;
        console.log(postId);
        wx.navigateTo({
            url: 'post-detail/post-detail?id='+postId
        })
    }
})