# FloatWindow
javaScript 和 CSS结合实现的地图点击查询窗口界面

写在前面：
====
由于本人能力有限，因此整个项目也有许多地方有待完善，如给您带来不便还望谅解，同时也希望各路大神能提出宝贵的建议和意见，大家共同学习，共同进步，谢谢！！

项目介绍：
====
一个简单的地图信息点击查询界面，采用悬浮窗口的样式设计。
<br>地图渲染引擎为[`leaflet`](https://leafletjs.com/)，使用按钮图标库为[`Font Awesome`](https://fontawesome.com/?from=io),项目使用了`JQuery`库<br>如需移植到其他地图项目需自行修改`floatWindow.js`文件中的地图监听方法和屏幕坐标与经纬度坐标转换方法等<br>

应用背景
====
通过`经纬度`进行数据库数据查询，将`主要数据`进行窗口展示，建议在显示信息很多的情况下增加详细信息展板

兼容性
====
已测试Google Chrome浏览器、 FireFox浏览器、IE11浏览器可用，其他浏览器请自测

效果预览
====
![Image text](https://raw.githubusercontent.com/Victorfy1214/FloatWindow/master/preview/GIF.gif)

使用方法
====
请参照leaflet官网自行创建地图

引用样式`floatWindow.css`文件
```html
 <link rel="stylesheet" href="css/floatWindow.css"><link>
 ```
 引用font-awesome样式
 ```html
 <link href="http://cdn.bootcss.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
 ```
 引用JQuery库
 ```html
 <script src="js/jquery.min.js"></script>
 ```
 在`body`标签中添加如下标签
 ```html
 <div class = "root-point unSelectable">
    <i class="fa fa-times menu-close" aria-hidden="true" title="关闭"></i>
    <i class="fa fa-bar-chart menu-chart"aria-hidden="true"  title="统计表"></i>

    <div class="loading-spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    </div>

    <div class = "content-div"></div>
    <div class = "info-line"></div>
    <div class="dot"></div>
    <div class="pulse-inner"></div>
    <div class="pulse-outer"></div>
</div>
 ```
 引用floatWindow.js文件
  ```html
 <script type="text/javascript" src="js/floatWindow.js"></script>
 ```
 新建FloatWindow对象,并传入leaflet地图对象,
 ```javascript
 let floatWindow = new FloatWindow(map);//map是新建的地图对象，不是地图Div容器
 ```
 添加FloatWindow的监听函数
 ```javascript
    floatWindow.setMapClickListener(function(latLng){//latLng为leaflet经纬度对象
    
        console.log(latLng.lat + " ; " + latLng.lng);//打印经纬度信息
        
        //获取处理后的结果，避免多次回调，传递参数latlng，回调函数传回参数value为经纬度
        floatWindow.getDealResult(latLng,function(value){
            //进行数据查询后进行数据显示
            setTimeout(function () {
                //传2个参数，Type 和 Value
                // Type值可取WND、QY、以及其他任意值
                //填写不同TYPE会有不同图标
                //Value为要显示的数值 如 "经度：121"
                floatWindow.addInfo('WND',value.lng.toFixed(3) + " ; " + value.lat.toFixed(3));
                floatWindow.addInfo('QY',value.lng.toFixed(3) + " ; " + value.lat.toFixed(3));
            },1000);
        });
    });
 ```
封装方法介绍
====

* `setMapClickListener`： 此监听方法用于回调地图的经纬度变化，参数`ClickCallBack`，传入你的回调函数
* `addInfo`：该方法用于添加窗口展板信息，包含两个参数`Type`和`Value`,Type值不同，展板图标不同，Value为展板具体信息
* `closeFloatWindow`：该方法用于关闭悬浮展板
* `closeLoadingAnimation`：该方法用于关闭加载动画
* `setChartBtnListener`：设置图表按钮的功能*此功能为本人项目需要*,参数`clickCallBack`，传入你的回调函数
* `getDealResult`：用于判断经纬度信息是否改变，解决展板数据重复问题，参数latlng 经纬度对象，callback（Value）回调函数，Value为处理后的经纬度

以上方法均通过对象调用，如floatWindow.setMapClickListener();

* *`DisabledMapClickListener`: 该`函数`用来禁用FloatWindow的监听，请在需要的地方直接调用方法，如 `DisabledMapClickListener（true）;`，重新启用监听请使用 `DisabledMapClickListener（false）;`
