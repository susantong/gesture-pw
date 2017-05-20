## 实现手势密码的思路

1. 整个过程的思路：

	（1）用户输入密码，如果密码长度少于5位，则初始化面板(createCircle)，否则，存储路径圆心坐标值(lastPoint),进入下一步。

	（2）用户再次输入密码，存储路径圆心坐标值，将两次路径值的index属性变为字符串比较（localstorage存储的必须为字符串），如果相同，则提示密码设置成功，并将字符串存储在localStorage中，可以进行解码操作，否则失败，提示重新输入密码(this.resetTitle('请输入手势密码');)，重新渲染面板

	（3）解码操作，同样存储路径的index值，变为字符串进行比较，如果相同则解码成功，否则失败，重新输入密码

2. 主要函数说明：
	init(): 初始化（包括初始化面板，绑定事件等等）

	createCircle(): 初始化面板

	update(): 更新视图

	eventHandler(): 事件处理

	storePass(): 对不同步骤做不同处理

	drawLine(): 画路径
	
	drawCircle(): 画某一个圆