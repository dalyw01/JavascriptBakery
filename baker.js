'use strict';
const fetch = require('node-fetch');
const fs    = require('fs');
var dateObj = new Date();
var month   = dateObj.getUTCMonth() + 1; //months from 1-12
var day     = dateObj.getUTCDate();
var year    = dateObj.getUTCFullYear();
var curr_date = day + "/" + month + "/" + year;

var html = '';
html = html + '<head><title>Bakery</title><link rel="stylesheet" type="text/css" href="index.css"><meta charset="UTF-8"></head>';
html = html + '<h1>Bakery 🍩</h1><p>Last scan took place on - ' + curr_date + '</p>';
html = html + '<ul>';
html = html + '<li><a href="#Front Page">HELLO</a></li>';
html = html + '</ul>';

function grabNews( new_title , new_url )
{
	fetch( new_url , { method: 'Get' } )
	    .then(res => res.json())
	    .then((json) => 
		{
			html = html + `<h2 id="${new_title}">News - ` + new_title + '</h2>';
	    	for( let [k, v] of Object.entries(json))
	    	{
	    		if( k == 'relations' )
	    		{
	    			for( let [k1, v1] of Object.entries(v) )
	    			{
	    				for( let [k2, v2] of Object.entries(v1) )
	    				{
		    				for( let [k3, v3] of Object.entries(v2) )
		    				{
		    					for( let [k4, v4] of Object.entries(v3) )
			    				{
			    					for( let [k5, v5] of Object.entries(v4) )
			    					{
			    						if(v5['externalId'])
			    						{
			    							console.log('Vpid : ' + v5.externalId);
			    							html = html + '<table class="news"><tr>';
			   			    			html = html + '<th>🍩 ' + v5.externalId + '</th>';
			    							html = html + '<td>' + v5.duration/1000 + ' secs</td>';
			    							html = html + '<td>' + v5.duration + ' ms</td>';
			    							html = html + '<td>' + v5.caption + '</td>';
			    							html = html + '</tr></table>';
			    						}
			    					}
			    				}
		    				}
	    				}
					}
				}
			}
		});
}

function grabPlayer( new_title , new_url )
{
	fetch( new_url , { method: 'Get' } )
	    .then(res => res.json())
	    .then((json) => 
		{
			html = html + `<h2 id="${new_title}">Player - ` + new_title + '</h2>';
	    	for( let [k, v] of Object.entries(json))
	    	{
	    		if( k == 'group_episodes' && k != 'undefined')
	    		{
	    			for( let [k1, v1] of Object.entries(v) )
	    			{
	    				for( let [k2, v2] of Object.entries(v1) )
	    				{
	    					if(v2.id && v2.id != 'undefined')
	    					{
	    						console.log('Vpid : ' + v2.id);
		    					html = html + '<table class="iplayer"><tr>';
		    					html = html + '<tr>';
			    				html = html + '<td>' + v2.title + '</td>';
			    				html = html + '<td>' + v2.id + '</td>'; //Parent PID
			    				for( let [k3, v3] of Object.entries(v2) )
			    				{
			    					for( let [k4, v4] of Object.entries(v3))
			    					{
			    						// priority_content gives an non-playable vpid...which isn't very helpful
		    							if( v4.id && v4.kind != 'priority_content' )
		    							{
											console.log('Vpid : ' + v4.id);
		    								html = html + '<tr>';
			    							html = html + '<th>🍩 ' + v4.id + '</th>';
			    							html = html + '<td>' + v4.kind + '</td>';
			    				    		if(v4.guidance)
			    				    		{
			    				    			html = html + '<td>' + v4.guidance.text.medium + '</td>';
			    				    		}
				  		    				if(v4['duration'])
				    						{
				    							html = html + '<td>' + v4.duration.text + '</td>';
				    						}
			    				    		html = html + '</tr>';
			    						}
			    					}
			    				}
		    					html = html + '</tr></table>';
		    				}
	    				}
					}
				}
			}
		});	
}

function grabSounds( new_title , new_url )
{
	fetch( new_url , { method: 'Get' } )
    .then(res => res.json())
    .then((json) => 
	{
		html = html + `<h2 id="${new_title}">Sounds - ` + new_title + '</h2>';
		for( let [k,v] of Object.entries(json))
		{
			for( let [k1,v1] of Object.entries(v))
			{
				if(v1.id)
				{
					console.log('Vpid : ' + v1.id);
					html = html + '<table class="sounds"><tr>';
					html = html + '<th>🍩' + v1.id + '</th>';
					html = html + '<td>' + v1.duration.label + '</td>';
					html = html + '<td>' + v1.duration.value + ' Seconds</td>';
					html = html + '<td>' + v1.titles.primary + '</td>';
					html = html + '<td>' + v1.network.id + '</td>';
					html = html + '<td>' + v1.synopses.short + '</li>';
					html = html + '</tr></table>';
				}
			}
		}
	})
}

grabPlayer('Popular'  		  , 'json_here.json');
grabNews('Technology'   	  , 'json_here.json');
grabSounds('Rock And Indie' , 'json_here.json');

setTimeout(function(){ fs.writeFile('bakery.html', html , function (err) {
  	if (err) return console.log(err);
  	console.log('🍩🍩🍩 Writing to bakery.html 🍩🍩🍩');
});; }, 7000);

