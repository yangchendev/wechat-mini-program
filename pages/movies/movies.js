var util = require("../../utils/utils.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchResult:{},
        containerShow: true,
        searchPanelShow: false,
        cancelImgShow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var apiHost = app.globalData.doubanBase;
        var inTheatersUrl = apiHost + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = apiHost + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = apiHost + "/v2/movie/top250" + "?start=0&count=3";
        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "经典高分电影");
    },
    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category,
        });
    },
    getMovieListData: function (url, settedKey, categoryTitle) {
        wx.showLoading({
            title: '加载中...',
        });
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                "Content-Type": "json"
            },
            success: function (res) {
                console.log(res);
                that.processDoubanData(res.data, settedKey, categoryTitle);
                wx.hideLoading();
            },
            fail: function (error) {

            },
            complete: function () {

            }
        })
    },
    processDoubanData: function (moviesDouban, settedkey, categoryTitle) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp);
        }
        var readyData = {};
        readyData[settedkey] = {
            categoryTitle: categoryTitle,
            movies: movies
        }
        this.setData(readyData);
    
    },
    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true,
            cancelImgShow: true
        });
    },
    onBindInput: function (event) {
        var searchText = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + searchText;
        this.getMovieListData(searchUrl,"searchResult","");
    },
    onBindConfirm: function (event) {

    },
    onCancelImageTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            cancelImgShow: false
        });
        
    },
    onMovieItemTap:function(event){
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + movieId,
        });
    }
})