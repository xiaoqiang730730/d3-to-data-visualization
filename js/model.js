	var nodes = [{
		'uuid': '111',
		'type': 'vm',
		'vm_name': 'centos',
		'ip': '192.168.1.1',
		'gip': '192.168.1.8'
	}, {
		'uuid': '112',
		'type': 'vm',
		'vm_name': 'centos',
		'ip': '192.168.1.2',
		'gip': '192.168.1.8'
	}, {
		'uuid': '113',
		'type': 'vm',
		'vm_name': 'centos',
		'ip': '192.168.1.3',
		'gip': '192.168.1.8'
	}, {
		'uuid': '114',
		'type': 'vm',
		'vm_name': 'centos',
		'ip': '192.168.1.4',
		'gip': '192.168.1.8'
	}, {
		'uuid': '115',
		'type': 'vm',
		'vm_name': 'centos',
		'ip': '192.168.1.5',
		'gip': '192.168.1.8'
	}, {
		'uuid': '116',
		'type': 'vm',
		'vm_name': 'centos',
		'ip': '192.168.1.6',
		'gip': '192.168.1.8'
	}, {
		'uuid': '117',
		'type': 'docker',
		'vm_name': 'centos',
		'ip': '192.168.1.7',
		'gip': '192.168.1.8'
	}, {
		'uuid': '118',
		'type': 'docker',
		'vm_name': 'centos',
		'ip': '192.168.1.8',
		'gip': '192.168.1.8'
	}];
	var links = [{
		source: '111',
		target: '112'
	}, {
		source: '111',
		target: '113'
	}];
    function finduuid(nodes, uuid) {
		for (var i in nodes) {
			if (nodes[i].uuid == uuid) {
				return nodes[i];
				break;
			}
		}
	}
	function linkFormate(links, nodes) {
		for (var i in links) {
			links[i].source = finduuid(nodes, links[i].source);
			links[i].target = finduuid(nodes, links[i].target);
			links[i].id=parseInt(i);
		}
		return links;
	}
	function findLink(link, links) {
		for (var i in links) {
			if (links[i].source == link.source && links[i].target == link.target) {
				return i;
				break;
			} else if (links[i].source == link.target && links[i].target == link.source) {
				return i;
				break;
			}
		}
		return -1;
	}
	function deleteLink(link, links) {
		for (var i in links) {
			if (links[i] == link) {
				links.splice(i, 1);
			}
		}
	}
	links = linkFormate(links, nodes);
	var force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.linkDistance([200])
		.alpha(0.1)
		.size([width, height])
		.gravity(0.01)
		.charge(-150)
		.chargeDistance(-350)
		.start();

	var g_link=g1.append('g');
	var g_edges=g_link.selectAll('g')
					.data(links,function(d){
						return d.id
					})
					.enter()
					.append('g');
	var edges = g_edges.append('line')
					.classed('link',true);
	var g_path=g_edges.append('path')
					.attr("opacity","0");
	
	var drag = d3.behavior.drag()
		.origin(function(d) {
			return {
				x: d.x,
				y: d.y
			};
		})
		.on('drag', dragmove)
		.on('dragstart', function(d) {
			d3.event.sourceEvent.stopPropagation();
		});

	function dragmove(d) {
		d.x = d3.event.x;
		d.y = d3.event.y;
		d3.select(this)
			.attr('transform', "translate(" + d3.event.x + "" + ',' + "" + d3.event.y + ")");
		edges.attr('x1', function(d) {
			return d.source.x;
		})
			.attr('y1', function(d) {
				return d.source.y + 22;
			})
			.attr('x2', function(d) {
				return d.target.x;
			})
			.attr('y2', function(d) {
				return d.target.y + 22;
			});
		g_path.attr("d",function(d){
			var trace="M"+d.source.x+" "+(d.source.y+22)+" A 100 30 0 0 0 "+d.target.x+" "+(d.target.y+22)+"M"+d.target.x+" "+(d.target.y+22)+" A 100 30 0 0 0 "+d.source.x+" "+(d.source.y+22);
			return trace;
		});
		force.start();
		//console.log(d3.event.x, d3.event.y);
	};


var g_nodes=g1.append('g');
var g2=g_nodes.selectAll('g')   //node部分
	     .data(nodes)
	     .enter()
	     .append('g')
	     .call(drag);

	var vm_num = 0;
var images = g2
		.append('image')
		.attr({
			width: 44,
			height: 44
		})
		.attr('x',-22)
		.attr('xlink:href',function(d){
			if(d.type=='vm'){return 'image/pc.png';}
			else if(d.type=='docker'){return 'image/container.png'}
			
		});
var texts = g2
		.append('text')
		.text(function(d) {
			return d.ip;
		})
		.attr('text-anchor','middle')
		.attr('y',parseInt(d3.select('image').attr('height'))+5)
		.attr('font-family', 'sans-serif')
		.attr('font-size', 'large');

force.on('tick', function() {
		g2.attr('transform', function(d) {
			return "translate(" + d.x + "," + d.y + ")"
		});
		edges.attr('x1',function(d){return d.source.x;})
		 .attr('y1',function(d){return d.source.y+22;})
		 .attr('x2',function(d){return d.target.x;})
		 .attr('y2',function(d){return d.target.y+22;});
		// g_path.attr("d",function(d){
		// 	var trace="M"+d.source.x+" "+(d.source.y+22)+" A 100 30 0 0 0 "+d.target.x+" "+(d.target.y+22)+"M"+d.target.x+" "+(d.target.y+22)+" A 100 30 0 0 0 "+d.source.x+" "+(d.source.y+22);
		// 	return trace;
		// });
		g_path.attr("d",function(d){
			var x1=d.source.x,y1=d.source.y+22,x3=d.target.x,y3=d.target.y+22;
			var p1=[x1,y1];
			var p3=[x3,y3];
			var p2=[(x1+x3+y3-y1)/2,(y1+y3+x1-x3)/2];
			var p4=[(x1+x3-y3+y1)/2,(y1+y3-x1+x3)/2];
			var p5=middle(p1,p3);
			var p6=middle(p2,p5);
			var p7=middle(p4,p5);
			var traces="M"+p1+" Q"+p6+" "+p3+"M"+p3+" Q"+p7+" "+p1;
			return traces;
		})
	});

function redraw(){
	
	g_edges=g_edges.data(links,function(d){return d.id});
	var g3=g_edges.enter().insert('g',":nth-child(3)")
						.on('click', lineclick)
       					.on('mouseover',lineOver)
       					.on('mouseout',lineOut);
	g3.append("line")
		.classed("link",true);
	g3.append("path")
		.attr("opacity","0");
	edges=g_edges.selectAll("line");
	g_path=g_edges.selectAll("path");
	g_edges.exit().remove();

	g2=g2.data(nodes);
	var g1=g2.enter().insert('g')
							.call(drag)
							.on('mouseover', imageover)
    						.on('mouseout', imageout);
		g1.append("image")
				.attr({
					width: 44,
					height: 44
				})
				.attr('x',-22)
				.attr('xlink:href',function(d){
					if(d.type=='vm'){return 'image/pc.png';}
					else if(d.type=='docker'){return 'image/container.png'}
					
				})
				.on('click', imageclick);
		g1.append("text")
			.text(function(d) {
				return d.ip;
			})
			.attr('text-anchor','middle')
			.attr('y',parseInt(d3.select('image').attr('height'))+5)
			.attr('font-family', 'sans-serif')
			.attr('font-size', 'large');
	images=g2.selectAll("image");
	texts=g2.selectAll("text");
	g2.exit().remove();
	force.start();
}
function middle(point1,point2){
		var x=(point2[0]-point1[0])/2+point1[0];
		var y=(point2[1]-point1[1])/2+point1[1];
		return [x,y];
}
	