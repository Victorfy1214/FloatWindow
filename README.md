# FloatWindow
javaScript 和 CSS结合实现的地图点击查询窗口界面

项目介绍：
====
一个简单的地图信息点击查询界面，采用悬浮窗口的样式设计。
<br>地图渲染引擎为[`leaflet`](https://leafletjs.com/)，使用按钮图标库为[`Font Awesome`](https://fontawesome.com/?from=io),项目使用了`JQuery`库<br>如需移植到其他地图项目需自行修改`floatWindow.js`文件中的地图监听方法和屏幕坐标与经纬度坐标转换方法等<br>

应用背景
====
通过`经纬度`进行数据库数据查询，将`主要数据`进行窗口展示，建议在显示信息很多的情况下增加详细信息展板

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
        
           //进行查询操作并调用信息展板传递信息
           
           setTimeout(function () {
           
                //传2个参数，Type 和 Value
                // Type值可取WND、QY、以及其他任意值
                //填写不同TYPE会有不同图标
                //Value为要显示的数值 如 "经度：121"
                
                floatWindow.addInfo('WND',latLng.lng.toFixed(3) + " ; " + latLng.lat.toFixed(3));
                
            },500);
    });
 ```
 
