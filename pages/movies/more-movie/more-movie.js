// pages/movies/more-movie/more-movie.js
var util = require("../../../utils/utils.js");
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigateTitle:"",
        movies:{},
        requestUrl:"",
        totalCount:0,
        isEmpty:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var category = options.category;
        var dataUrl = "";
        var apiHost = app.globalData.doubanBase;
        this.setData({
            navigateTitle:category
        })
       
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
        });
        switch(category){
            case "正在热映":
                dataUrl = apiHost+"/v2/movie/in_theaters";
            break;
            case "即将上映":
                dataUrl = apiHost + "/v2/movie/coming_soon";
            break;
            case "经典高分电影":
                dataUrl = apiHost + "/v2/movie/top250";
            break;
        }
        this.setData({
            requestUrl:dataUrl
        });
        util.http(dataUrl, this.processDoubanData);

    },
    onReachBottom:function(event){
        var nextUrl = this.data.requestUrl+
        "?start="+this.data.totalCount+"&count=20";
        util.http(nextUrl, this.processDoubanData);
    },
    processDoubanData: function (moviesDouban){
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
        var totalMovies = {};
        
        if(!this.data.isEmpty){
            totalMovies = this.data.movies.concat(movies);
        }else{
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({
            movies: totalMovies
        });
        this.data.totalCount += 20;
        wx.hideNavigationBarLoading();
    },
    onPullDownRefresh:function(event){
        var refreshUrl = this.data.requestUrl + 
        "?start=0&count=20";
        this.data.isEmpty = true;
        this.data.totalCount= 0;
        this.setData({
            movies: {}
        });
        util.http(refreshUrl,this.processDoubanData);
        wx.stopPullDownRefresh();
    
    },
    onMovieItemTap: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + movieId,
        });
    }

})