// npm install node-fetch  | node -v v12.16.1 | william daly
'use strict';
const fetch = require('node-fetch');
const fs    = require('fs');
var time = new Date().toISOString().
  replace(/T/, ' ').      // replace T with a space
  replace(/\..+/, '')     // delete the dot and everything after

var html = '';
html = html + '<head><title>Bakery</title><link rel="stylesheet" type="text/css" href="bakery.css"><meta charset="UTF-8"></head>';
html = html + '<h1>VPID Bakery 🍩🥐🍪</h1><p>Last scan took place on - ' + time + '</p>';
html = html + '<ul>';
html = html + '<li><a href="#Front Page">Front Page</a></li>';
html = html + '</ul>';

function createCookbookLink( new_vpid )
{
	// Create Base64 Object
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/++[++^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	var string = '{"items": [{"versionID": "' + new_vpid + '" }]}';
	var encodedString = Base64.encode(string);
	return (`https://LOL.COM/?settings=eyJwcm9kdWN0IjoibmV3cyIsInN1cGVyUmVzcG9uc2l2ZSI6dHJ1ZX0%3D&&playlist=${encodedString}`);
}

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
											console.log('News : ' + v5.externalId);
											html = html + '<table class="news"><tr>';
											html = html + '<th><a target="_blank" href="' + createCookbookLink(v5.externalId) +'">🥐' + v5.externalId + '</a></th>';
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
								console.log('Iplayer Parent Vpid : ' + v2.id);
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
											console.log('Iplayer Child Vpid : ' + v4.id);
											html = html + '<tr>';
											html = html + '<th><a target="_blank" href="' + createCookbookLink(v4.id) +'">🍩' + v4.id + '</a></th>';
											html = html + '<td>' + v4.kind + '</td>';
											if(v4.guidance)
											{
												html = html + '<td>⚠️' + v4.guidance.text.medium + '</td>';
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

function grabSound( new_title , new_url )
{
	fetch( new_url , { method: 'Get' } )
	.then(res => res.json())
	.then((json) => 
	{
		html = html + `<h2 id="${new_title}">Sound - ` + new_title + '</h2>';
		for( let [k,v] of Object.entries(json))
		{
			for( let [k1,v1] of Object.entries(v))
			{
				if(v1.id)
				{
					console.log('Sounds Vpid : ' + v1.id);
					html = html + '<table class="sounds"><tr>';
					html = html + '<th><a target="_blank" href="' + createCookbookLink(v1.id) +'">🍪' + v1.id + '</a></th>';
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


grabPlayer('Less Popular'  , 'https://some.api.json');
grabNews('Front Page'      , 'https://some.api.json');
grabSound('Music'          , 'https://some.api.json');

const wait_time = 7000;

setTimeout(function(){ fs.writeFile('bakery.html', html , function (err) {
  	if (err) return console.log(err);
  	console.log('🍩🍩🍩 Writing to bakery.html 🍩🍩🍩');
});; }, wait_time);
