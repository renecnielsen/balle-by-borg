import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import d3_request from 'd3-request';
import d3_geo from 'd3-geo';
import d3_hexbin from 'd3-hexbin';

import App from 'App';
import suffixList from 'SuffixList';

import "../html/index.html";
import "../sass/main.sass";
import placenamesPath from "file!../data/placenames_dk.tsv"

const projection = d3_geo.geo
	.mercator()
	.center([13.8, 55.98])
	.translate([330, 210])
	.scale(3000)
;

const hexbin = d3_hexbin.hexbin()
	.x((d)=>d.x)
	.y((d)=>d.y)
	.size([200, 400])
	.radius(5)
;

d3_request.csv(placenamesPath, (d)=> {
	d.forEach((x)=>{
		x.label = x.name;
		// project geo to screen coordinates
		[x.x, x.y] = projection([+x.longitude, +x.latitude]);
	});

	let hbData = hexbin(d);

	// unique IDs for bins
	hbData.forEach((x)=>{
		x.id =  `${x.i}/${x.j}`;
	});

	// sort alphabetically by first suffix in list
	suffixList.sort((a,b)=>{
		if(a[0]>b[0]) return 1;
		if(a[0]<b[0]) return -1;
		return 0;
	});


	ReactDOM.render(
		<App suffixList={suffixList} data={hbData}/>,
		document.getElementById('app')
	);

});
