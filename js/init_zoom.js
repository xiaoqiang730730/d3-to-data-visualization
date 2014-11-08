//<i><span title=" ">&nbsp;&nbsp;&nbsp;&nbsp;温馨提示：滚动鼠标滚轮，可以放大、缩小画布</span></i>
function initElement() {
    /*
    <div class="draw">
        <div id="tool" title="工具栏">
            <i><button id="cursor"></button></i>
            <i><button id="scissor"></button></i>
            <i><button id="line"></button></i>
        </div>
        <div id="roll">
            <div id="roll_button">
                <div id="roll_buttonN" title="向上"></div>
                <div id="roll_buttonW" title="向左"></div>
                <div id="roll_buttonE" title="向右"></div>
                <div id="roll_buttonS" title="向下"></div>
            </div>
            <div id="roll_slider">
                <div id="slider_plus">
                </div>
                <div id="slider" class="slider_center"></div>
                <div id="slider_minus">
                </div>
            </div>
        </div>
        <div id="image_infos">
            <table>
                <tr>
                    <td id="image_vm"><img src="./image/pc.png"></td>
                    <td class="image_name">VM</td>
                </tr>
                <tr>
                    <td id="image_docker"><img src="./image/container.png"></td>
                    <td class="image_name">Docker</td>
                </tr>
            </table>
        </div>
        <div id="play" class="show">
        </div>
        <div id="alertpanel"></div>
    </div>
    */
};

function tip() {
    /*
    <div id="tip" class="hidden">
        <a id="tip_closed" class="tip_close">×</a>
        <table id="info">
            <tr><td class="atr">name</td><td class='val' id="node_name"></td></tr>
            <tr><td class="atr">logic_ip</td><td class='val' id="node_ip"></td></tr>
            <tr><td class="atr">gateway</td><td class='val' id="node_gip"></td></tr>
            <tr><td class="atr">port</td><td class='val' id="node_port"></td></tr>
        </table>
        <div class="machines">
                <button class="machine">开机</button>
                <button class="machine">暂停</button>
                <button class="machine">关机</button>
        </div>
    </div>
    */
};

function tipInfo() {
    /*
    
    */
}
var tp1 = {
    init: initElement,
    tooltip: tip,
    tipInfos: tipInfo
};

function getTp1(m) {
    var r = /\/\*([\S\s]*?)\*\//m,
        m = r.exec(tp1[m].toString());
    return m && m[1] || m;
};
var init_elements = getTp1('init');
$('body').append(init_elements);
var init_tip = getTp1('tooltip');
$('body').append(init_tip);
var domain = [0.5, 5];
var width = document.getElementById("play").offsetWidth,
    height = document.getElementById("play").offsetHeight;
var svg = d3.select("#play").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", 'all')
    .style('overflow', 'hidden')
    .append('g')
    .call(d3.behavior.zoom().scaleExtent(domain).on("zoom", zoom))
    .on('dblclick.zoom', null);

var g1 = svg.append("g")
    .attr('id', 'g1');
g1.append("rect")
    .classed('overlay', false)
    .attr("width", width)
    .attr("height", height)
    .attr('opacity', 0);

function zoom() {
    g1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    roll_zoom();
}

function rollButton() {
    var roll_buttons = $("#roll_button div");
    var position = ["0px", "0px"].join(" ");
    var translate = [0, 0];
    var d = 80;
    for (var i = 0, n = roll_buttons.length; i < n; i++) {
        switch (roll_buttons[i].id) {
            case "roll_buttonN":
                position = ["0px", "-44px"].join(" ");
                translate = [0, -d];
                rollMouseEvent("#roll_buttonN", position, translate);
                break;
            case "roll_buttonS":
                position = ["0px", "-132px"].join(" ");
                translate = [0, d];
                rollMouseEvent("#roll_buttonS", position, translate);
                break;
            case "roll_buttonE":
                position = ["0px", "-88px"].join(" ");
                translate = [d, 0];
                rollMouseEvent("#roll_buttonE", position, translate);
                break;
            case "roll_buttonW":
                position = ["0px", "-176px"].join(" ");
                translate = [-d, 0];
                rollMouseEvent("#roll_buttonW", position, translate);
                break;
        }
    }
};
rollButton();

function rollMouseEvent(id, position, translate) {
    console.log(id, position);
    $(id).mouseover(function() {
        console.log(id, "mouseover");
        $("#roll_button").css('background-position', position);
    });
    console.log($(id));
    $(id).mouseout(function() {
        console.log(id, "mouseout");
        $("#roll_button").css('background-position', "0px 0px");
    });
    $(id).click(function() {
        var trans = coordinate(g1.attr("transform"));
        var s = scale(g1.attr('transform'));
        g1.attr("transform", "translate(" + coordinateAdd(trans, translate) + ")scale(" + s + ")");
    });
}

function coordinate(translate) {
    if (translate) {
        var m;
        if (translate.indexOf(",") == -1) {
            m = translate.split(' ');
        } else {
            m = translate.split(',');
        }
        //var m=translate.split(',');
        var x = m[0].split('(');
        var t = m[1].split(')');
        return [x[1], t[0]];
    } else {
        return [0, 0];
    }
}

function coordinateAdd(trans1, trans2) {
    console.log(trans1, trans2);
    x = parseInt(trans1[0]) + parseInt(trans2[0]);
    console.log(parseInt(trans1[0]), parseInt(trans2[0]));
    y = parseInt(trans1[1]) + parseInt(trans2[1]);
    console.log(parseInt(trans1[1]), parseInt(trans2[1]));
    return [x, y].join(',');
}
var roll_click = true;

function roll_zoom() {
    var roll = $("#slider");
    roll_click = false;
    console.log(scale(g1.attr('transform')));
    var value = (scale(g1.attr('transform')) - domain[0]) / (domain[1] - domain[0]) * 100;
    roll.slider('value', value);
}

function roll_zoom_init() {
    $("#slider").slider({
        orientation: "vertical",
        range: "min"
    });
    var roll = $("#slider");
    // roll.slider('optiom', 'min', 0.5);
    // roll.slider('optiom', 'max', 5);
    var value = (scale(g1.attr('transform')) - domain[0]) / domain[1] * 100;
    roll.slider('value', value);
    console.log(roll.slider('value'));
}
roll_zoom_init();

function scale(scales) {
    if (scales) {
        console.log(scales);
        var t = scales.split("scale(");
        console.log(t);
        var m = t[1].split(')');
        return m[0];
    } else {
        return 1;
    }
}

$("#slider").mouseover(function(e) {
    roll_click = true;
    console.log(roll_click);
});

function roll_move() {
    var value1 = $('#slider').slider('value');
    console.log(value1);
    $('#slider').bind('slidechange', function(event, ui) {
        console.log("slidechange", roll_click);
        if (roll_click) {
            var value2 = $('#slider').slider('value');
            console.log(value1);
            console.log(value2);
            roll_action(value1, value2);
            value1 = value2;
        }
    });

}

function roll_action(value1, value2) {
    if (value1 != value2) {
        var tran_d_x = (value2 - value1) / 100 * (domain[1] - domain[0]) * (-500),
            tran_d_y = (value2 - value1) / 100 * (domain[1] - domain[0]) * (-250);
        console.log(tran_d_x);
        var trans = coordinate(g1.attr("transform"));
        var s = value2 / 100 * (domain[1] - domain[0]) + domain[0];
        console.log(s);
        g1.attr("transform", "translate(" + coordinateAdd(trans, [tran_d_x, tran_d_y]) + ")scale(" + s + ")");
    }
}
roll_move();
$("#slider_plus").bind({
    mouseover: function(e) {
        $(this).css('background-position', "0px -243px");
    },
    mouseout: function(e) {
        $(this).css('background-position', "0px -221px");
    },
    click: function(e) {
        e.stopPropagation();
        svg.call(d3.behavior.zoom().scaleExtent(domain).on("zoom", zoom));
        var value = $("#slider").slider("value");
        roll_click = false;
        if ((value + 20) <= 100) {
            roll_action(value, value + 20);
            $("#slider").slider("value", value + 20);
        } else {
            roll_action(value, 100);
            $("#slider").slider("value", 100);
        }
    }
});
$("#slider_minus").bind({
    mouseover: function(e) {
        $(this).css('background-position', "0px -287px");
    },
    mouseout: function(e) {
        $(this).css('background-position', "0px -265px");
    },
    click: function(e) {
        e.stopPropagation();
        var value = $("#slider").slider("value");
        roll_click = false;
        if ((value - 20) >= 1) {
            roll_action(value, value - 20);
            $("#slider").slider("value", value - 20);
        } else {
            roll_action(value, 1);
            $("#slider").slider("value", 1);
        }
    }
});