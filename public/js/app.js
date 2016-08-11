/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var reposlist_ts_1 = __webpack_require__(1);
	var gistCreator_ts_1 = __webpack_require__(6);
	///////
	var RList = new reposlist_ts_1.Reposlist();
	RList.inputWatch('repo-search');
	/////
	var GistObj = new gistCreator_ts_1.GistCreator();
	var newGistBtn = document.getElementById('new-gist-btn');
	newGistBtn.addEventListener('click', function () {
	    var gistDescription = document.getElementById('gist-description');
	    var gistFilename = document.getElementById('gist-filename');
	    var gistText = document.getElementById('gist-text');
	    var gist = {
	        filename: gistFilename.value,
	        description: gistDescription.value,
	        text: gistText.value
	    };
	    GistObj.createGist(gist);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var github_api_ts_1 = __webpack_require__(2);
	var repoList_ts_1 = __webpack_require__(4);
	var Reposlist = (function () {
	    function Reposlist() {
	        this.api = new github_api_ts_1.githubApi();
	    }
	    Reposlist.prototype.stop = function () {
	        this.api.stop();
	    };
	    Reposlist.prototype.getList = function () {
	        this.api.setCallback(this.renderList); //beware: renderList() does'nt have this context
	        this.api.getRepos(this.filter);
	    };
	    Reposlist.prototype.renderList = function (data) {
	        var dataObj = JSON.parse(data);
	        var tpl = repoList_ts_1["default"](dataObj.items);
	        var resEl = document.getElementById('result');
	        resEl.innerHTML = tpl;
	    };
	    Reposlist.prototype.inputWatch = function (idElement) {
	        var inp = document.getElementById(idElement);
	        var that = this;
	        inp.addEventListener('keyup', function (e) {
	            if (this.value.length > 2 && that.lastSearch !== this.value) {
	                that.filter = this.value;
	                that.lastSearch = this.value;
	                that.stop();
	                that.getList();
	            }
	        });
	    };
	    return Reposlist;
	}());
	exports.Reposlist = Reposlist;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var request_ts_1 = __webpack_require__(3);
	var githubApi = (function () {
	    function githubApi() {
	        var AObj = new request_ts_1.Request();
	        this.setAjaxObj(AObj);
	    }
	    githubApi.prototype.getRepos = function (filter) {
	        var url = 'https://api.github.com/search/repositories';
	        var options = {
	            q: filter,
	            in: 'name',
	            sort: 'stars',
	            order: 'desc',
	            page: '1',
	            per_page: '3'
	        };
	        this.ajax.get(url, options, this.callback);
	    };
	    githubApi.prototype.newGist = function (gistOptions) {
	        var url = 'https://api.github.com/gists';
	        this.ajax.post(url, gistOptions, this.callback);
	    };
	    githubApi.prototype.setAjaxObj = function (obj) {
	        this.ajax = obj;
	    };
	    githubApi.prototype.setCallback = function (callback) {
	        this.callback = callback;
	    };
	    githubApi.prototype.stop = function () {
	        this.ajax.abortRequest();
	    };
	    return githubApi;
	}());
	exports.githubApi = githubApi;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var Request = (function () {
	    function Request() {
	        this.clearCache();
	        this.cacheClearTime = 120000;
	        // get XMLHttpRequest for IE or normal browsers 
	        var xhttp;
	        try {
	            xhttp = new ActiveXObject("Msxml2.XMLHTTP");
	        }
	        catch (e) {
	            try {
	                xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	            }
	            catch (E) {
	                xhttp = false;
	            }
	        }
	        if (!xhttp && typeof XMLHttpRequest != 'undefined') {
	            xhttp = new XMLHttpRequest();
	        }
	        this.xhttp = xhttp;
	        this.cacheClearer = window.setInterval(this.clearCache, this.cacheClearTime);
	    }
	    /**
	     * GET-Method request
	     */
	    Request.prototype.get = function (addr, options, callback) {
	        var self = this;
	        var reqUrl = this.addOptions(addr, options);
	        var timeout = setTimeout(function () { self.abortRequest(); }, 10000);
	        if (self.getReqCache[reqUrl] !== undefined) {
	            var cacheResponce = self.getReqCache[reqUrl];
	            callback(cacheResponce);
	        }
	        else {
	            // open connection  
	            this.xhttp.open('GET', reqUrl, true);
	            // this.xhttp.onreadystatechange = this.checkAnswer();
	            this.xhttp.onreadystatechange = function () {
	                // if request was done
	                if (this.readyState != 4)
	                    return;
	                // cancel abort timeout
	                clearTimeout(timeout); // clear timeout if was readyState 4
	                // if request answer is ok
	                if (this.status == 200) {
	                    self.getReqCache[reqUrl] = this.response;
	                    callback(this.response);
	                }
	                else {
	                    console.warn('server ansveres with status: ' + this.status);
	                }
	            };
	            this.xhttp.send();
	        }
	    };
	    /**
	     *  POST-Method request
	     */
	    Request.prototype.post = function (addr, options, callback) {
	        var self = this;
	        var reqUrl = addr;
	        var timeout = setTimeout(function () { self.abortRequest(); }, 10000);
	        // var urlOptions = this.optionsToStringUrl( options );
	        var urlOptions = JSON.stringify(options);
	        // open connection  
	        this.xhttp.open('POST', reqUrl, true);
	        // this.xhttp.onreadystatechange = this.checkAnswer();
	        this.xhttp.onreadystatechange = function () {
	            // if request was done
	            if (this.readyState != 4)
	                return;
	            // cancel abort timeout
	            clearTimeout(timeout); // очистить таймаут при наступлении readyState 4
	            // if request answer is ok
	            if (this.status == 200 || this.status == 201) {
	                callback(this.response);
	            }
	            else {
	                console.warn('server ansveres with status: ' + this.status);
	            }
	        };
	        this.xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	        this.xhttp.send(urlOptions);
	    };
	    Request.prototype.abortRequest = function () {
	        this.xhttp.abort();
	    };
	    Request.prototype.clearCache = function () {
	        this.getReqCache = {};
	    };
	    Request.prototype.addOptions = function (addr, options) {
	        var reqUrl = addr;
	        // if options set
	        if (Object.keys(options).length) {
	            reqUrl += '?';
	            reqUrl += this.optionsToStringUrl(options);
	        }
	        return reqUrl;
	    };
	    Request.prototype.optionsToStringUrl = function (options) {
	        var urlOpt = '';
	        for (var q in options) {
	            urlOpt += q + '=' + options[q] + '&';
	        }
	        return urlOpt;
	    };
	    return Request;
	}());
	exports.Request = Request;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var repoItem_ts_1 = __webpack_require__(5);
	function repoListRender(items) {
	    var itemsHtml = '';
	    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
	        var item = items_1[_i];
	        itemsHtml += repoItem_ts_1["default"](item);
	    }
	    return "\n        <div class=\"repos-list\">\n            " + itemsHtml + "\n        </div>\n    ";
	}
	exports.__esModule = true;
	exports["default"] = repoListRender;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	function repoItemRender(item) {
	    return "\n        <div class=\"repo-item well bg-success\">\n            <div class=\"repo-item-name\">\n               <div><strong>Name: </strong> <span class=\"text-success\"> " + item.name + " </span></div>\n            </div>\n            <div class=\"repo-item-description\">\n                <div class=\"dtext\">\n                    <strong>Description: </strong>\n                    <span class=\"text-warning\"> " + item.description + "</span>\n                </div>\n            </div>\n            <div class=\"repo-item-lang\">\n                <div>\n                    <strong class=\"dtext\">Language: </strong>\n                    <span class=\"text-warning dtext\"> " + item.language + "</span>\n                </div>\n            </div>\n            <div class=\"repo-item-lang\">\n                 <div>\n                    <strong class=\"dtext\">Url: </strong>\n                    <a href=\"" + item.url + "\" class=\"dtext\"> Git (" + item.name + ")</a>\n                 </div>\n            </div>\n        </div>\n    ";
	}
	exports.__esModule = true;
	exports["default"] = repoItemRender;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var github_api_ts_1 = __webpack_require__(2);
	var gistlink_ts_1 = __webpack_require__(7);
	var GistCreator = (function () {
	    function GistCreator() {
	        this.api = new github_api_ts_1.githubApi();
	    }
	    GistCreator.prototype.stop = function () {
	        this.api.stop();
	    };
	    GistCreator.prototype.createGist = function (gistProps) {
	        this.api.setCallback(this.showGist);
	        var gistOption = {
	            public: true,
	            files: {}
	        };
	        gistOption.description = gistProps.description;
	        gistOption.files[gistProps.filename] = {
	            content: gistProps.text
	        };
	        this.api.newGist(gistOption);
	    };
	    GistCreator.prototype.showGist = function (data, resultEl) {
	        var dataObj = JSON.parse(data);
	        var gistProps = {
	            url: dataObj.html_url,
	            description: dataObj.description
	        };
	        var gistItemHtml = gistlink_ts_1["default"](gistProps);
	        var resEl = document.getElementById('gists-list');
	        var gistEl = document.createElement('div');
	        gistEl.className = 'gist-element well';
	        gistEl.innerHTML = gistItemHtml;
	        resEl.appendChild(gistEl);
	    };
	    return GistCreator;
	}());
	exports.GistCreator = GistCreator;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	function renderGistLink(gist) {
	    return " <span class=\"text-success\">Gist Created</span> \n            <a class=\"gist-link\" href=\"" + gist.url + "\" target=\"blank\"> " + gist.description + " </a>";
	}
	exports.__esModule = true;
	exports["default"] = renderGistLink;


/***/ }
/******/ ]);