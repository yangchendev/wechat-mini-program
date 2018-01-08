var postsData = require("../../../data/posts-data.js")
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlayingMusic: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var postId = options.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        console.log(postData);
        this.setData({
            postData: postData
        })

        var postsCollected = wx.getStorageSync("posts_collected")
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            });
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync("posts_collected", postsCollected);
        }
        if(app.globalData.g_isPlayingMusic&&app.globalData.g_currentMusicPostId == postId){

            this.setData({
                isPlayingMusic:true
            });
        }else{
            this.setData({
                isPlayingMusic:false
            })
        }
        this.setAudioMonitor();
    },
    setAudioMonitor:function(){
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
            that.setData({
                isPlayingMusic: true
            })
        });
        wx.onBackgroundAudioPause(function () {
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
            that.setData({
                isPlayingMusic: false
            })
        });
        
    },
    onCollection: function (event) {
        //同步会阻塞线程
        var postsCollected = wx.getStorageSync("posts_collected");
        var postCollected = postsCollected[this.data.currentPostId];

        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        wx.setStorageSync("posts_collected", postsCollected);
        //更新数据绑定
        this.setData({
            collected: postCollected
        });
        // wx.showToast({
        //     title: postCollected?"收藏成功":"取消成功",
        //     duration:1000
        // });
        wx.showModal({
            title: '收藏',
            content: '是否要收藏该文章',
            showCancel: "true",
            cancelText: "不收藏",
            cancelColor: "#333",
            confirmText: "收藏",
            confirmColor: "#405f80"
        });
    },
    onShare: function (event) {

        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                wx.showModal({
                    title: '用户' + itemList[res.tapIndex],
                    content: '',
                });

            }
        })
    },
    onMusicTap: function (event) {
        var isPlayingMusic = this.data.isPlayingMusic;
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            });
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg
            });
            this.setData({
                isPlayingMusic: true
            });
        }

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})