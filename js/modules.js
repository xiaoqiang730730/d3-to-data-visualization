var link = [{
    'vm_id': '85b3b875-d715-41c0-a17b-d18ee9e4d66b',
    'link': ['8f307ea4-67bb-4c04-bfe1-5c95517d8a06', '5e3d08a7-ac63-45ed-9699-8b46753e6aa0']
}, {
    'vm_id': '8f307ea4-67bb-4c04-bfe1-5c95517d8a06',
    'link': ['85b3b875-d715-41c0-a17b-d18ee9e4d66b', '5e3d08a7-ac63-45ed-9699-8b46753e6aa0']
}, {
    'vm_id': '5e3d08a7-ac63-45ed-9699-8b46753e6aa0',
    'link': ['85b3b875-d715-41c0-a17b-d18ee9e4d66b', '8f307ea4-67bb-4c04-bfe1-5c95517d8a06']
}];

var select_node = null;
var select_scissor = false;
var select_drawline = false;
var scissor = $('#scissor');
var links_length = links.length;
var interval = null;
scissor.click(function() {
    $("#play").hover(function() {
        $(this).css({
            cursor: "url(./image/gui_scissors.ico),crosshair"
        });
    });
    select_scissor = true;
    var tips = d3.select("#tip")
        .classed('hidden', true);
    select_node = null;
    select_drawline = false;
});


var cursor = $('#cursor');
cursor.click(function() {
    $('#play').hover(function() {
        $(this).css({
            cursor: "pointer"
        });

    });
    edges.classed('linkscissor', false);
    select_node = null;
    select_scissor = false;
    select_drawline = false;
});

var line_ico = $('#line');
line_ico.click(function() {
    $('#play').hover(function() {
        $(this).css({
            cursor: "url(./image/wired_top.cur),auto"
        });

    });
    edges.classed('linkscissor', false);
    select_drawline = true;
    select_scissor=false;
    var tips = d3.select("#tip")
        .classed('hidden', true);
});


var tip_closed = $('#tip_closed');
tip_closed.click(function() {
    var tips = d3.select("#tip")
        .classed('hidden', true);
});

$("#tip").bind({
    mouseover: function() {
        d3.select("#tip")
        .classed('hidden', false);
        if(interval){
            window.clearInterval(interval);
            interval=null;
        }
    },
    mouseout: function() {
        d3.select("#tip")
        .classed('hidden', true);
    }
})

console.log(g2);
//var line_insert='<line x1="0" y1="0" x2="0" y2="0" style="stroke: rgb(0, 128, 0); stroke-width: 4px;"></line>';
var drag_line = g1.insert("svg:line", ":nth-child(2)")
    .style('stroke', "green")
    .style('stroke-width', 4)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 0);
g1.on('mousemove', mousemove)
    .on('click', mouseclick);
g2.on('mouseover', imageover)
    .on('mouseout', imageout);

function mousemove() {
    d3.event.preventDefault();
    if (!select_node) {
        if (select_drawline) {
            $('#play').css({
                cursor: "url(./image/wired_top.cur),auto"
            });
        }
        return;
    }
    $('#play').css({
        cursor: "url(./image/wired_bottom.cur),auto"
    });
    drag_line
        .attr("x1", select_node.x)
        .attr("y1", select_node.y + 22)
        .attr("x2", d3.mouse(this)[0])
        .attr("y2", d3.mouse(this)[1]);
};

function mouseclick() {
    console.log('g1click');
    d3.event.preventDefault();
    if (select_node) {
        $('#play').css({
            cursor: "url(./image/wired_top.cur),auto"
        });
        drag_line
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", 0);

        select_node = null;
    }
    // var tips = d3.select("#tip")
    //     .classed('hidden', true);
}

images.on('click', imageclick);


function imageclick(d) {
    console.log('imageclick');
    console.log(d);
    console.log(d3.mouse(this));
    console.log(d3.select(this));
    console.log($(this).offset());
    console.log(d3.event.x, d3.event.y);
    var e = d3.event || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    e.preventDefault();
    d3.event.preventDefault();
    if (select_drawline) {
        if (select_node && select_node != d) {
            var add_link = {
                source: select_node,
                target: d
            };
            if (findLink(add_link, links) == -1) {
                links.push({
                    id: links_length,
                    source: select_node,
                    target: d
                });
                links_length++;
                redraw();
            }
            select_node = null;
            drag_line
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", 0);
        } else {
            select_node = d;
            drag_line
                .attr("x1", select_node.x)
                .attr("y1", select_node.y + 22)
                .attr("x2", select_node.x)
                .attr("y2", select_node.y + 22);
        }
    }
}

function imageover(d) {
    console.log('imageover');
    var e = d3.event || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    e.preventDefault();
    d3.event.preventDefault();
    if (!select_scissor && !select_drawline) {
        var xPosition = parseFloat($(this).find('image').offset().left);
        var yPosition = parseFloat($(this).offset().top);
        console.log(xPosition, yPosition);
        var image_width = $(this).attr('width') - $("#tip").width();
        image_width *= scale(g1.attr('transform')) * 0.5;
        console.log(image_width);
        console.log(d3.select('image').attr('width'));
        $("#tip").css('left', xPosition - $("#tip").width() - $(this).find('image').attr('width') / 1.5);
        $("#tip").css('top', yPosition - $("#tip").height() / 2);
        var tips = d3.select("#tip")
            .classed('hidden', false);
        // .style('left',xPosition)
        // .style('right',yPosition);
        tips.select("#node_name").text(d.vm_name + 'sngosdgflxdngfcnfgml');
        tips.select("#node_ip").text(d.ip);
        tips.select("#node_gip").text(d.gip);

        if(interval){
            window.clearTimeout(interval);
            interval=null;
        }
    }
    //tips.select("#node_port").text(d.gip);
}

function imageout(d) {
    console.log('imageout');
    var e = d3.event || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    e.preventDefault();
    d3.event.preventDefault();
    interval = window.setTimeout(function() {
        d3.select("#tip")
            .classed('hidden', true);
    }, 50);
    // var tips = d3.select("#tip")
    //     .classed('hidden', true);
}
g_edges.on('click', lineclick)
       .on('mouseover',lineOver)
       .on('mouseout',lineOut);

function lineclick(d) {
    console.log('lineclick');
    var e = d3.event || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    e.preventDefault();
    d3.event.preventDefault();
    if (select_scissor) {
        console.log(d);
        deleteLink(d, links);
        redraw();
    }
}

function lineOver(d) {
    console.log('lineOver');
    var e = d3.event || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    e.preventDefault();
    d3.event.preventDefault();
    console.log(this);
    if (select_scissor) {
        d3.select(this).select('line')
            .classed('link', false)
            .classed('linkscissor', false)
            .attr('stroke', "red")
            .attr('stroke-width', 7);
        d3.select(this).transition()
            .duration(1)
            .attr('stroke-width', 17);
    }

}

function lineOut(d) {
    console.log('lineOut');
    var e = d3.event || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    e.preventDefault();
    if (select_scissor) {
        d3.select(this).select('line')
            .classed('link', true)
            .classed('linkscissor', false);
        // d3.select(this).transition()
        //     .duration(1)
        //     .attr('stroke-width', 4);
    }

}