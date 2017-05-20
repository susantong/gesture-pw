var gesture = {
	ctx: document.getElementById('paint').getContext('2d'),
	body: document.body,
	title: document.getElementById('title'),
	psw: {
		step: 0,
		first: [],
		second: [],
		p1: '',
		p2: '',
		p3: ''
	},
	// 画出n*n的矩阵
	n : 3, 
	//半径值
	r: '', 
	count: -1,
	initObj: {
		//存储滑过的路径
		lastPoint: [], 
		//存储所有圆的圆心值
	  arr: [], 
	  restPoint: [],
	  //存储滑过路径的剩余值 
	  touchflag: false
	},
	getR: function () {
		this.r = this.ctx.canvas.width / (2 + 4 * this.n);
	},
	//获取想对canvas元素的坐标值
	getPos: function (e) {
		var rect = document.getElementById('paint').getBoundingClientRect();
		var pos = {
			x: e.touches[0].clientX - rect.left,
			y: e.touches[0].clientY - rect.top
		};
		return pos;
	},
	//判断是否在圆内
	judgeCirle: function (pos, item) {
		return Math.abs(pos.x - item.x) < this.r && Math.abs(pos.y - item.y) < this.r
	},
	//画圆并根据颜色值填充
	drawCircle: function (color, i, arr) {
		this.ctx.beginPath();
		this.ctx.strokeStyle="#ccc";
		this.ctx.lineWidth = 2;
		this.ctx.arc(arr[i].x,arr[i].y,this.r,0,360,false);
		this.ctx.stroke();
		this.ctx.fillStyle = color;
		this.ctx.fill();//画实心圆
		this.ctx.closePath();
	},
	//画路径
	drowLine: function (pos) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = 'red';
		this.ctx.moveTo(this.initObj.lastPoint[0].x, this.initObj.lastPoint[0].y);				
		for (var i = 1; i < this.initObj.lastPoint.length; i++) {
			this.ctx.lineTo(this.initObj.lastPoint[i].x, this.initObj.lastPoint[i].y);
		}
		this.ctx.lineTo(pos.x, pos.y);
		this.ctx.stroke();
		this.ctx.closePath();
	},
	//画初始面板
	createCircle: function () {
		this.initObj.lastPoint = [];
		this.initObj.restPoint = [];
		this.initObj.arr = [];
		this.initObj.touchflag = false;
	  this.count = -1;
		for (var i = 0 ; i < this.n ; i++) {
		  for (var j = 0 ; j < this.n ; j++) {
		    this.count++;
		    this.initObj.arr.push({
		        x: j * 4 * this.r + 3 * this.r,
		        y: i * 4 * this.r + 3 * this.r,
		        index: this.count
		    });
		    this.initObj.restPoint.push({
		        x: j * 4 * this.r + 3 * this.r,
		        y: i * 4 * this.r + 3 * this.r,
		        index: this.count
		     });
		  }
	  }
	    //初始化面板
	  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	  for (var i = 0; i < this.initObj.arr.length; i++) {
	    this.drawCircle('#fff', i, this.initObj.arr);
	  }

	  if (this.psw.step == 2) {
	    this.storePass();
	  }
	},
	//判断是设置密码还是验证密码
	isSetPw: function () {
		return document.getElementsByTagName('input')[0].checked ? 1 : 0;
	},
	//设置title值
	resetTitle: function (title) {
		setTimeout(function () {
			this.title.innerHTML = title;
		}, 2000);
	},
	//初始化
	init: function () { 
		this.initObj.lastPoint = [];
		this.initObj.arr = [];
		this.initObj.restPoint = [];
		this.initObj.touchflag = false;
	  this.getR();
	  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.createCircle();
		//console.log(this.initObj.arr);
	  this.eventHandler();

	},
	//更新视图
	update: function (pos) {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		for (var i = 0; i < this.initObj.arr.length; i++) {
			this.drawCircle('#fff', i, this.initObj.arr);
		}
		for (var j = 0; j < this.initObj.lastPoint.length; j++) {
			this.drawCircle('#ffa726', j, this.initObj.lastPoint);
		}
		//console.log(this.initObj.resePoint);
		for (var i = 0, len = this.initObj.restPoint.length; i < len; i++) {
			if (Math.abs(pos.x - this.initObj.restPoint[i].x) < this.r && Math.abs(pos.y - this.initObj.restPoint[i].y) < this.r) {
			  this.initObj.lastPoint.push(this.initObj.restPoint[i]);
			  this.initObj.restPoint.splice(i, 1);
			  //this.drawCircle('#ffa726', i, this.initObj.arr);
			  this.drawCircle('#ffa726', this.initObj.lastPoint.length-1, this.initObj.lastPoint);
			  break;
			}
		}
		this.drowLine(pos);
	},
	//存储路径index值
	storeIndex: function (arr, tag) {
		var len = this.initObj.lastPoint.length;
		for (var i = 0; i < len; i++) {
			arr.push(this.initObj.lastPoint[i].index);
		}
	},
	//对不同步骤的操作
	storePass: function () {
		if (this.isSetPw()) {
			if (this.psw.step == 1) {
				console.log('step1');
				this.psw.step = 2;
				this.storeIndex(this.psw.second);
				console.log(this.psw.second);
				//console.log(this.initObj.restPoint);
				this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
				this.createCircle();
			} else if (this.psw.step == 2) {
				//console.log('step2');
				this.psw.step = 0;
				for (var i = 0; i < this.psw.first.length; i++) {
					this.psw.p1 += this.psw.first[i];
				}
				for (var i = 0; i < this.psw.second.length; i++) {
					this.psw.p2 += this.psw.second[i];
				}
				if (this.psw.p1 === this.psw.p2) {
					this.title.innerHTML = '密码设置成功';
					window.localStorage.setItem('password', this.psw.p1);
				} else {
					this.title.innerHTML = '两次输入的不一致';
					this.resetTitle('请重新设置手势密码');	
				}
				this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
				this.createCircle();
			} else {
				this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
				if (this.initObj.lastPoint.length < 5) {
					this.title.innerHTML = '密码太短，至少需要5个点';
					this.resetTitle('请输入手势密码');
				} else {
					this.psw.step = 1;
					this.storeIndex(this.psw.first);
					//console.log(this.psw.first);
					//console.log(this.initObj.restPoint);
					this.title.innerHTML = '请再次输入手势密码';
				}
				this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
				this.createCircle();
			}
		} else {
			if (window.localStorage.getItem('password')) {
				for (var i = 0; i < this.initObj.lastPoint.length; i++) {
					this.psw.p3 += this.initObj.lastPoint[i].index;
				}
				if (this.psw.p3 === window.localStorage.getItem('password')) {
					this.title.innerHTML = '密码正确！';
				} else {
					this.title.innerHTML = '输入的密码不正确';
				}
				this.resetTitle('请输入手势密码');
				document.getElementsByTagName('input')[0].checked = 'checked';
				document.getElementsByTagName('input')[1].checked = '';
				this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
				this.createCircle();
			} 
		}
	},
	//事件处理
	eventHandler: function () {
		var that = this;
		this.body.addEventListener('touchstart', function (e) {
			var pos = that.getPos(e);
			that.initObj.lastPoint = [];
			//console.log(pos);
			for (var i = 0; i < that.initObj.arr.length; i++) {
				if (that.judgeCirle(pos, that.initObj.arr[i])) {
					that.initObj.touchflag = true;
			    	that.initObj.lastPoint.push(that.initObj.arr[i]);
			    	that.initObj.restPoint.splice(i, 1);
			    	that.drawCircle("#ffa726", i, that.initObj.arr);
			    	//console.log(i);
					break;
				}
			}
		}, false);

		this.body.addEventListener('touchmove', function (e) {
			if (that.initObj.touchflag) {
				that.update(that.getPos(e));
			}
		}, false);

		this.body.addEventListener('touchend', function () {
			if (that.initObj.touchflag) {
				that.initObj.touchflag = false;
				that.ctx.clearRect(0, 0, that.ctx.canvas.width, that.ctx.canvas.height);
				for (var i = 0; i < that.initObj.arr.length; i++) {
					that.drawCircle('#fff', i, that.initObj.arr);
				}
				that.storePass();
			}
		}, false);
	}
};