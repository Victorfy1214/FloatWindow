
//存放鼠标点击位置经纬度
let click_Point;
//存放传入的地图对象
let map_obj;
//定位圆点对象
let dot_obj = $('.dot');
//定义内圈动画对象
let pulse_inner = $('.pulse-inner');
//定义外圈动画对象
let pulse_outer = $('.pulse-outer');
//定义牵引线对象
let line_info =  $('.info-line');
//定义信息显示面板对象
let content_info = $('.content-div');
//定义关闭按钮对象
let close_btn = $('.menu-close');
//定义图表按钮对象
let chart_btn = $('.menu-chart');
//定义加载动画对象
let loading_div = $('.loading-spinner');
//floatWindow对象
let fw_div = $('.root-point');
//记录初始点击处的位置
let clickX,clickY;
//判断flotWindow是否显示
let fw_display = false;
//记录回调函数
let CallBackFunction;
//是否禁止mapClick的监听
let disable_listener = false;
//处理点击或拖动控件时无处地图拖动的控制变量
let dealMapMove = true;
//处理拖拽，拖拽时不触发点击的回调函数
let dealDrag = false;
//处理点击，点击时不触发拖拽的回调函数
let dealClick = true;
//处理展板点击时重复加载数据
let dealDragMouseUp = false;

//定义封装函数
function FloatWindow(param){
    //将地图对象传值到全局变量
    map_obj = param;

    //为关闭按钮绑定监听函数
    close_btn.on('click',function () {
        //不显示floatWindow
        setDisplayMode('none');

        fw_display = false;
    });

    content_info.on('mousedown',Drag_MouseDown);

    //添加地图变动时的flotWindow位置变化函数
    MapMoveStart();
    MapMoveEnd();
}

//添加显示内容接口
FloatWindow.prototype.setMapClickListener = function (ClickCallBack) {

    CallBackFunction = ClickCallBack;

    //leaflet地图点击事件
    map_obj.on('click',function(event){

        if(disable_listener)
            return;
        //当误触地图拖动时不允许执行地图拖动的函数
        dealMapMove = false;

        dealDrag = false;

        dealClick  = true;

        //将鼠标点击位置转化成屏幕坐标
        const Client = map_obj.mouseEventToContainerPoint(event.originalEvent);

        click_Point = event.latlng;

        //在地图上定位
        setPosition(Client.x,Client.y);

        //设置数据显示面板位置
        setContentInfoPosition(Client.x,Client.y);

        //为信息显示框赋值经纬度信息
        content_info.html('');
        content_info.append('<div style="display:flex;align-items:center;"> <i class="fa fa-map-marker icon-location" aria-hidden="true"></i> <div class = "fw-latLng"> '+"经度:" + click_Point.lng .toFixed(3) + " , 纬度:" + click_Point.lat.toFixed(3) +'</div> </div>');


        //显示loading加载动画
        setLoadingDisplayMode("block");

        if(dealClick)
            controlCount(CallBackFunction,click_Point,900);

    });

};

//添加新的数据内容接口
FloatWindow.prototype.addInfo = function (type,value) {
    addContent(type,value);
};

//关闭floatWindow
FloatWindow.prototype.closeFloatWindow = function () {
    setDisplayMode("none");
};

//添加图标按钮监听事件接口
FloatWindow.prototype.setChartBtnListener = function (clickCallBack) {
    chart_btn.on('click',function(){
        clickCallBack();
    });

};

//添加关闭加载动画功能
FloatWindow.prototype.closeLoadingAnimation = function () {
    setLoadingDisplayMode('none');
};


//禁用MapClick的监听事件
function DisabledMapClickListener (value) {
    disable_listener = value;
}

let timeout;
function controlCount(func,params, wait) {

    clearTimeout(timeout);
    timeout = setTimeout(function(){
        timeout = null;
        func(params);
    }, wait);
}

function Drag_MouseDown(event){

    dealDrag = true;

    dealClick = false;

    $(window).on('mousemove',Drag_MouseMove);
    $(window).on('mouseup',Drag_MouseUp);

    let e = event || window.event;//兼容event事件处理

    clickX = e.clientX - content_info.offset().left ;
    clickY = e.clientY - content_info.offset().top;

}

function Drag_MouseMove(event){
    let e = event || window.event;//兼容event事件处理

    const child_count = content_info.children().length;
    const content_height = content_info.height();

    const top_fixed = content_height / child_count;

    const x =  event.clientX - clickX -50;
    let y = 0;
    if(child_count ===1)
        y = event.clientY - clickY +30;
    else
        y = event.clientY - clickY +50;
    if(clickX + content_info.offset().left -  event.clientX  >=0 || clickY + content_info.offset().top - event.clientY >= 3)
    {


        //为信息显示框赋值经纬度信息
        content_info.html('');
        //将鼠标点击位置转化成屏幕坐标
        const Client = map_obj.containerPointToLatLng(L.point(x,y + top_fixed));

        content_info.append('<div style="display:flex;align-items:center;"> <i class="fa fa-map-marker icon-location" aria-hidden="true"></i> <div class = "fw-latLng"> '+"经度:" + Client.lng .toFixed(3) + " , 纬度:" + Client.lat.toFixed(3) +'</div> </div>');


        dealDragMouseUp = true;
        click_Point = Client;
    }

    else
        dealDragMouseUp = false;


    setPosition(x,y + top_fixed);

    setContentInfoPosition(x,y + top_fixed);


}

function Drag_MouseUp(){

    //当误触地图拖动时不允许执行地图拖动的函数
    dealMapMove = false;

    if(dealDrag && dealDragMouseUp){
        //显示loading加载动画
        setLoadingDisplayMode("block");
        controlCount(CallBackFunction,click_Point,900);
        dealDragMouseUp = false;
    }


    dealClick = true;

    $(window).off('mousemove');
    $(window).off('mouseup');
}

//定义地图开始挪动时的监听
function MapMoveStart(){

   map_obj.on('movestart',function(){
        if(fw_div.css('display') === "block"){
            fw_display = true;
            setDisplayMode('none');
        } else{
            fw_display = false;
        }

    });
}

//定义地图结束挪动时的监听
function MapMoveEnd(){

    map_obj.on('moveend',function(){
        const bounds = map_obj.getBounds();
		
        if(fw_display && bounds.contains(click_Point) ){
            const new_position =  map_obj.latLngToContainerPoint(click_Point);
            
            setPosition(new_position.x,new_position.y );

            const child_count = content_info.children().length;
            const content_height = content_info.height();
            const top_fixed = content_height / child_count;

            if(dealMapMove)
                setContentInfoPosition(new_position.x,new_position.y - (top_fixed /2));
            else
                setContentInfoPosition(new_position.x,new_position.y);
        }

    });
}
//是否显示悬浮窗
function setDisplayMode(value){
    fw_div.css('display',value);
}

//设置窗口的位置
function setPosition(x,y) {

    //显示整个floatWindow控件
    setDisplayMode('block');

    fw_display = true;

    //设置圆点的位置
    setDotPosition(x,y);
    //设置跳动动画位置
    setPulsePosition(x,y);
    //设置牵引线位置
    setLineInfoPosition(x,y);

    //设置关闭按钮位置
    setCloseBtnPosition(x,y);
    //设置图标功能位置
    setChartBtnPosition(x,y);
    //设置加载动画的位置
    setLoadingPosition(x,y);
}

//设置加载动画显示模式
function setLoadingDisplayMode(value){
    loading_div.css('display',value);
}
//设置加载动画位置
function setLoadingPosition(x,y){
    loading_div.css('left',x + 60);
    loading_div.css('top',y - 10);
}
//设置中心圆点的位置
function setDotPosition(x,y){
    dot_obj.css('left',x);
    dot_obj.css('top',y);

}

//设置跳动动画的位置
function setPulsePosition(x,y){

    pulse_inner.css('left',x - 14);
    pulse_inner.css('top',y - 14);

    pulse_outer.css('left',x - 14);
    pulse_outer.css('top',y - 14);
}

//设置关闭按钮位置
function setCloseBtnPosition(x,y){
    close_btn.css('left',x + 255);
    close_btn.css('top',y - 60);
}

//设置图表按钮位置
function setChartBtnPosition(x,y){
    chart_btn.css('left',x + 255);
    chart_btn.css('top',y - 25);
}

//设置显示信息面板的位置
function setContentInfoPosition(x,y){
    if(x !==0)
        content_info.css('left',x + 50);

    if(y !== 0)
        content_info.css('top',y - 50);
}

//设置牵引线的位置
function setLineInfoPosition(x,y){
    line_info.css('left',x + 25);
    line_info.css('top',y - 39);
}

//添加要素信息
function addContent(type,value){
    //fa-file-powerpoint-o 大气压
    //fa-file-word-o 风
    //fa-file-text-o 其他

    const child_count_before = content_info.children().length;

    $(".info-message").remove();
    const child_count_after = content_info.children().length;

    let icon_str = "";
    if(type === "QY")//气压
    {
        icon_str = '<i class="fa icon-location fa-file-powerpoint-o" aria-hidden="true"></i>';
    }else if(type === "WND")//风
    {
        icon_str = '<i class="fa icon-location fa-file-word-o" aria-hidden="true"></i>';
    }else{//其他情况
        icon_str = '<i class="fa icon-location fa-file-text-o" aria-hidden="true"></i>';
    }
    content_info.append('<div  class = "info-message"><div class = "separation-line"></div><div style="display:flex;align-items:center;">'+icon_str +'<div class = "fw-latLng"> '+value +'</div> </div></div>');

    setLoadingDisplayMode("none");

    const content_height = content_info.height();
    const content_top = content_info.offset().top;
    const child_count = content_info.children().length;
    if(child_count_before - child_count_after <=0)
        setContentInfoPosition(0,  content_top + (content_height / child_count));

    //允许执行地图拖动的函数
    dealMapMove = true;
}
