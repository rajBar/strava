(this.webpackJsonpstrava=this.webpackJsonpstrava||[]).push([[0],{18:function(e,t,a){e.exports=a(53)},23:function(e,t,a){},24:function(e,t,a){},28:function(e,t,a){},32:function(e,t,a){},33:function(e,t,a){},53:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),r=a(15),s=a.n(r),c=(a(23),a(3)),l=a(4),u=a(6),o=a(5),m=(a(24),a(8)),d=a(7),h=a.n(d),v=a(1),y=a(9),f=a(10),p=a(2),b=a.n(p),k=(a(28),a(16)),E=function(e){Object(u.a)(a,e);var t=Object(o.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={runSegments:2.5,cycleSegments:5},n}return Object(l.a)(a,[{key:"parseOptions",value:function(e,t){return{title:"Lifetime "+e+"s",hAxis:{title:"date"},vAxis:{title:"run"===e?"min/"+t:("km"===t?"k":"m")+"ph",gridlines:{units:{hours:{format:[""]},minutes:{format:["mm:ss"]},seconds:{format:["mm:ss"]}}}},bubble:{textStyle:{fontSize:11}}}}},{key:"formatSpeed",value:function(e){var t=e.toString().split("."),a=t[0],n=t[1];return new Date(2e3,0,1,1,parseInt(a),parseInt(n),0)}},{key:"getDate",value:function(e){var t=e.split("/"),a=parseInt(t[0]),n=parseInt(t[1])-1,i=parseInt(t[2])+2e3;return new Date(i,n,a)}},{key:"getSegK",value:function(e,t){var a=parseFloat(e),n="run"===t?this.state.runSegments:this.state.cycleSegments,i=Math.ceil(a/n)*n;return i-n+"k - "+i+"k"}},{key:"getThreeM",value:function(e){var t=parseFloat(e),a=3*Math.ceil(t/3);return a-3+"m - "+a+"m"}},{key:"parseData",value:function(e,t,a){var n=this,i=[],r="run"===t?"N/A":"Speed (km/h)",s="run"===t?this.state.runSegments+"k":this.state.cycleSegments+"k",c=["ID","Date",r,"km"===a?s:"3m","Distance"];return i.push(c),b.a.sortBy(e,(function(e){return parseFloat(e.distance)})).forEach((function(e){var r="km"===a?e.averageSpeed:e.averageSpeedMile,s="km"===a?e.distance:e.distanceMile,c="km"===a?n.getSegK(s,t):n.getThreeM(s),l=parseFloat(r);"run"===t&&(l=n.formatSpeed(r));var u=[r,n.getDate(e.date),l,c,parseFloat(s)];i.push(u)})),i}},{key:"render",value:function(){var e=this.props,t=e.activity,a=e.rows,n=e.unit,r=[].concat(a).reverse(),s=this.parseData(r,t,n),c=t?this.parseOptions(t,n):[];return i.a.createElement("div",{className:"App"},i.a.createElement(k.a,{chartType:"BubbleChart",width:"100%",height:"400px",data:s,options:c}))}}]),a}(n.Component),g=function(e){Object(u.a)(a,e);var t=Object(o.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={tableHead:["Name","No. Runs","Run Distance","No. Cycles","Cycle Distance"],tableHeadSecond:["Date","Activity","Distance","Average Speed","Activity Time","Elevation Gain"],currentActivity:"run",user:"",unit:"km",sort:{field:"date",direction:!0}},n}return Object(l.a)(a,[{key:"getHeader",value:function(e,t){var a=this;return e.map((function(e,n){return t?i.a.createElement("th",{className:"myTableHeaders",onClick:function(){return a.setSort(e)}},e):i.a.createElement("th",{className:"myTableHeaders"},e)}))}},{key:"setSort",value:function(e){var t=this.state.sort,a=e!==t.field||!t.direction;console.log(e),this.setState(Object(v.a)(Object(v.a)({},this.state),{},{sort:{field:e,direction:a}}))}},{key:"setUser",value:function(e){var t=this.state.user===e?"":e;this.setState(Object(v.a)(Object(v.a)({},this.state),{},{user:t}))}},{key:"getRowsData",value:function(e,t){var a=this,n=this.state.user,r=e.name,s=e.runQuantity,c=e.runDistance,l=e.runDistanceMile,u=e.bikeQuantity,o=e.bikeDistance,m=e.bikeDistanceMile,d=e.totalPercent,h=this.state.unit;return i.a.createElement("tr",{className:n===r?"selectedRow":"selectableRow",onClick:function(){return a.setUser(r)}},i.a.createElement("td",{key:t,className:"myTableContents"},r," ",100==d?"(completed)":""),i.a.createElement("td",{key:t,className:"myTableContents"},s),i.a.createElement("td",{key:t,className:"myTableContents"},"km"===h?c+"km":l+"miles"),i.a.createElement("td",{key:t,className:"myTableContents"},u),i.a.createElement("td",{key:t,className:"myTableContents"},"km"===h?o+"km":m+"miles"))}},{key:"setActivity",value:function(e){this.setState(Object(v.a)(Object(v.a)({},this.state),{},{currentActivity:e}))}},{key:"setUnit",value:function(e){this.setState(Object(v.a)(Object(v.a)({},this.state),{},{unit:e}))}},{key:"detailedRows",value:function(e){for(var t,a=this,n=this.state.user,r=0;r<e.length;r++)e[r].name==n&&(t=e[r]);if(""===n)return i.a.createElement("br",null);var s="run"===this.state.currentActivity?t.allRuns:t.allCycles;return i.a.createElement("div",null,i.a.createElement("button",{className:"run"===this.state.currentActivity?"selectedButton":"nonSelectedButton",onClick:function(){return a.setActivity("run")}},"Run"),i.a.createElement("button",{className:"cycle"===this.state.currentActivity?"selectedButton":"nonSelectedButton",onClick:function(){return a.setActivity("cycle")}},"Cycle"),s.length>0?i.a.createElement("div",null,i.a.createElement(E,{activity:this.state.currentActivity,rows:s,unit:this.state.unit}),i.a.createElement("table",{className:"myTableTwo"},i.a.createElement("thead",null,i.a.createElement("tr",null,this.getHeader(this.state.tableHeadSecond,"sorting function"))),i.a.createElement("tbody",null,s.map((function(e){var t=a.state.unit,n="km"===t?"km":"mile",r="km"===t?"k":"m";return i.a.createElement("tr",null,i.a.createElement("td",null,e.date),i.a.createElement("td",null,e.activity),i.a.createElement("td",null,"km"===t?e.distance+" km":e.distanceMile+" miles"),i.a.createElement("td",null,"km"===t?e.averageSpeed:e.averageSpeedMile," ","run"===a.state.currentActivity?"min/"+n:r+"ph"),i.a.createElement("td",null,e.movingTime," min"),i.a.createElement("td",null,e.elevationGain," m"))}))))):i.a.createElement("h6",{style:{paddingTop:"20px"}},this.state.user," is yet to ",this.state.currentActivity))}},{key:"render",value:function(){var e=this,t=this.props,a=t.allRows,n=t.orderedRows,r=this.state.sort;return a.forEach((function(e){"Date"===r.field?a=Object(m.a)(n):"Distance"===r.field?r.direction?(e.allRuns=b.a.orderBy(e.allRuns,(function(e){return Number(e.distance)}),"asc"),e.allCycles=b.a.orderBy(e.allCycles,(function(e){return Number(e.distance)}),"asc")):(e.allRuns=b.a.orderBy(e.allRuns,(function(e){return Number(e.distance)}),"desc"),e.allCycles=b.a.orderBy(e.allCycles,(function(e){return Number(e.distance)}),"desc")):"Average Speed"===r.field?r.direction?(e.allRuns=b.a.orderBy(e.allRuns,"averageSpeed","asc"),e.allCycles=b.a.orderBy(e.allCycles,"averageSpeed","asc")):(e.allRuns=b.a.orderBy(e.allRuns,"averageSpeed","desc"),e.allCycles=b.a.orderBy(e.allCycles,"averageSpeed","desc")):"Activity Time"===r.field?r.direction?(e.allRuns=b.a.orderBy(e.allRuns,"movingTime","asc"),e.allCycles=b.a.orderBy(e.allCycles,"movingTime","asc")):(e.allRuns=b.a.orderBy(e.allRuns,"movingTime","desc"),e.allCycles=b.a.orderBy(e.allCycles,"movingTime","desc")):"Elevation Gain"===r.field&&(r.direction?(e.allRuns=b.a.orderBy(e.allRuns,"elevationGain","asc"),e.allCycles=b.a.orderBy(e.allCycles,"elevationGain","asc")):(e.allRuns=b.a.orderBy(e.allRuns,"elevationGain","desc"),e.allCycles=b.a.orderBy(e.allCycles,"elevationGain","desc")))})),i.a.createElement("div",null,i.a.createElement("button",{className:"km"===this.state.unit?"selectedButton":"nonSelectedButton",onClick:function(){return e.setUnit("km")}},"Km"),i.a.createElement("button",{className:"miles"===this.state.unit?"selectedButton":"nonSelectedButton",onClick:function(){return e.setUnit("miles")}},"Miles"),i.a.createElement("table",{className:"myTable"},i.a.createElement("thead",null,i.a.createElement("tr",null,this.getHeader(this.state.tableHead))),i.a.createElement("tbody",null,a.map((function(t,a){return e.getRowsData(t,a)})))),this.detailedRows(a))}}]),a}(n.Component),S=(a(32),function(e){Object(u.a)(a,e);var t=Object(o.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={tableHead:["Name","No. Runs","Run Distance","No. Cycles","Cycle Distance","Total Complete"],tableHeadSecond:["Date","Activity","Distance","Average Speed","Activity Time","Elevation Gain"],currentActivity:"run",user:"",unit:"km"},n}return Object(l.a)(a,[{key:"getHeader",value:function(e){return e.map((function(e,t){return i.a.createElement("th",{className:"myTableHeaders"},e)}))}},{key:"setUser",value:function(e){var t=this.state.user===e?"":e;this.setState(Object(v.a)(Object(v.a)({},this.state),{},{user:t}))}},{key:"getRowsData",value:function(e,t){var a=this,n=this.state.user,r=e.name,s=e.runQuantity,c=e.runDistance,l=e.runDistanceMile,u=e.bikeQuantity,o=e.bikeDistance,m=e.bikeDistanceMile,d=e.totalPercentage,h=this.state.unit;return i.a.createElement("tr",{className:n===r?"selectedRow":"selectableRow",onClick:function(){return a.setUser(r)}},d>=100?i.a.createElement("td",{key:t,className:"myTableContents-complete"},r," (completed)"):i.a.createElement("td",{key:t,className:"myTableContents"},r),i.a.createElement("td",{key:t,className:"myTableContents"},s),i.a.createElement("td",{key:t,className:"myTableContents"},"km"===h?c+"km":l+"miles"),i.a.createElement("td",{key:t,className:"myTableContents"},u),i.a.createElement("td",{key:t,className:"myTableContents"},"km"===h?o+"km":m+"miles"),i.a.createElement("td",{key:t,className:"myTableContents"},d.toFixed(2),"%"))}},{key:"setActivity",value:function(e){this.setState(Object(v.a)(Object(v.a)({},this.state),{},{currentActivity:e}))}},{key:"setUnit",value:function(e){this.setState(Object(v.a)(Object(v.a)({},this.state),{},{unit:e}))}},{key:"detailedRows",value:function(e){for(var t,a=this,n=this.state.user,r=0;r<e.length;r++)e[r].name==n&&(t=e[r]);if(""===n)return i.a.createElement("br",null);var s="run"===this.state.currentActivity?t.allRuns:t.allCycles;return i.a.createElement("div",null,i.a.createElement("button",{className:"run"===this.state.currentActivity?"selectedButton":"nonSelectedButton",onClick:function(){return a.setActivity("run")}},"Run"),i.a.createElement("button",{className:"cycle"===this.state.currentActivity?"selectedButton":"nonSelectedButton",onClick:function(){return a.setActivity("cycle")}},"Cycle"),s.length>0?i.a.createElement("div",null,i.a.createElement(E,{activity:this.state.currentActivity,rows:s,unit:this.state.unit}),i.a.createElement("table",{className:"myTableTwo"},i.a.createElement("thead",null,i.a.createElement("tr",null,this.getHeader(this.state.tableHeadSecond))),i.a.createElement("tbody",null,s.map((function(e){var t=a.state.unit,n="km"===t?"km":"mile",r="km"===t?"k":"m";return i.a.createElement("tr",null,i.a.createElement("td",null,e.date),i.a.createElement("td",null,e.activity),i.a.createElement("td",null,"km"===t?e.distance+" km":e.distanceMile+" miles"),i.a.createElement("td",null,"km"===t?e.averageSpeed:e.averageSpeedMile," ","run"===a.state.currentActivity?"min/"+n:r+"ph"),i.a.createElement("td",null,e.movingTime," min"),i.a.createElement("td",null,e.elevationGain," m"))}))))):i.a.createElement("h6",{style:{paddingTop:"20px"}},this.state.user," is yet to ",this.state.currentActivity," in ",this.props.thisMonth))}},{key:"render",value:function(){var e=this,t=this.props,a=t.allRows,n=t.competitionDistance,r=(new Date).getMonth()+1;return i.a.createElement("div",null,i.a.createElement("h7",null,"Run ",n.run*r," km  &  Cycle ",n.cycle*r," km"),i.a.createElement("br",null),i.a.createElement("button",{className:"km"===this.state.unit?"selectedButton":"nonSelectedButton",onClick:function(){return e.setUnit("km")}},"Km"),i.a.createElement("button",{className:"miles"===this.state.unit?"selectedButton":"nonSelectedButton",onClick:function(){return e.setUnit("miles")}},"Miles"),i.a.createElement("table",{className:"myTable"},i.a.createElement("thead",null,i.a.createElement("tr",null,this.getHeader(this.state.tableHead))),i.a.createElement("tbody",null,a.map((function(t,a){return e.getRowsData(t,a)})))),this.detailedRows(a))}}]),a}(n.Component)),j=(a(33),function(e){Object(u.a)(n,e);var t=Object(o.a)(n);function n(e){var a;return Object(c.a)(this,n),(a=t.call(this,e)).state={activities:[],users:[],alerted:!1,competition:!1,competitionDistance:{run:30,cycle:60}},a.competitionSetter=a.competitionSetter.bind(Object(f.a)(a)),a}return Object(l.a)(n,[{key:"competitionSetter",value:function(){var e=this.state.competition;this.setState({competition:!e})}},{key:"notifyPhone",value:function(){var e=Object(y.a)(h.a.mark((function e(){var t,n,i;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=a(34),e.next=3,t.v4();case 3:n=e.sent,i="https://raj.bariah.com:2010/location?ipAddress="+n+"&device="+navigator.platform+"&site=Strava",this.state.alerted||(fetch(i,{method:"post"}),this.setState(Object(v.a)(Object(v.a)({},this.state),{},{alerted:!0})));case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"fetchData",value:function(){var e=Object(y.a)(h.a.mark((function e(t){var a,n=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a="https://raj.bariah.com:2010/strava/activity?athlete="+t,e.next=3,fetch(a).then((function(e){return e.json()})).then((function(e){var t=Object(m.a)(n.state.activities).concat(e);n.setState(Object(v.a)(Object(v.a)({},n.state),{},{activities:t}))}));case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"reAuthFunc",value:function(){var e=Object(y.a)(h.a.mark((function e(){var t=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.setUsers();case 2:this.state.users.forEach((function(e){t.fetchData(e.athleteID)}));case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"setUsers",value:function(){var e=Object(y.a)(h.a.mark((function e(){var t=this;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"https://raj.bariah.com:2010/strava/users",e.next=3,fetch("https://raj.bariah.com:2010/strava/users").then((function(e){return e.json()})).then((function(e){t.setState(Object(v.a)(Object(v.a)({},t.state),{},{users:e}))}));case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){this.reAuthFunc()}},{key:"findAllSpecificActivity",value:function(e,t,a){var n=Object(m.a)(this.state.activities).filter((function(a){return a.type===e&&a.athlete.id==t})),i=[];if(a){var r=new Date;n.forEach((function(e){var t=new Date(e.start_date);r.getFullYear()===t.getFullYear()&&i.push(e)}))}return a?i:n}},{key:"getAllKm",value:function(e,t){return Math.round(e+t.distance)}},{key:"createUserObj",value:function(e,t,a){var n=this.findAllSpecificActivity("Run",e,a),i=n.length>0?n.reduce(this.getAllKm,0)/1e3:0,r=this.findAllSpecificActivity("Ride",e,a),s=r.length>0?r.reduce(this.getAllKm,0)/1e3:0;return{name:t,runQuantity:n.length,runDistance:i,runDistanceMile:(.6214*i).toFixed(2),bikeQuantity:r.length,bikeDistance:s,bikeDistanceMile:(.6214*s).toFixed(2),allRuns:n.map((function(e,t){var a=e.distance/1e3,n=e.moving_time/60,i=(e.distance/1e3).toFixed(2),r=(.6214*a).toFixed(2),s=(e.moving_time/60).toFixed(0),c=1/(a/(n/60))*60,l=Math.floor(c),u=(l+.6*(c-l)).toFixed(2),o=1/(.6214*a/(n/60))*60,m=Math.floor(o),d=(m+.6*(o-m)).toFixed(2);return{date:e.start_date.substr(8,2)+"/"+e.start_date.substr(5,2)+"/"+e.start_date.substr(2,2),activity:"Run",distance:i,distanceMile:r,movingTime:s,averageSpeed:u,averageSpeedMile:d,elevationGain:e.total_elevation_gain}})),allCycles:r.map((function(e,t){var a=(e.distance/1e3).toFixed(2),n=(.6214*a).toFixed(2),i=(e.moving_time/60).toFixed(0),r=(a/(i/60)).toFixed(1),s=(.6214*r).toFixed(1);return{date:e.start_date.substr(8,2)+"/"+e.start_date.substr(5,2)+"/"+e.start_date.substr(2,2),activity:"Cycle",distance:a,distanceMile:n,movingTime:i,averageSpeed:r,averageSpeedMile:s,elevationGain:e.total_elevation_gain}}))}}},{key:"calculateTotalPercent",value:function(e){var t=(new Date).getMonth()+1,a=this.state.competitionDistance.run*t,n=this.state.competitionDistance.cycle*t,i=e.runDistance,r=e.bikeDistance,s=i>a?100:i/a*100,c=r>n?100:r/n*100,l=(s+c)/2===100?(i/a*100+r/n*100)/2:(s+c)/2;return Object(v.a)(Object(v.a)({},e),{},{totalPercentage:l})}},{key:"render",value:function(){var e=this,t=this.state.users;this.notifyPhone();var a=t.map((function(t){return e.createUserObj(t.athleteID,t.name,null)})),n=t.map((function(t){return e.createUserObj(t.athleteID,t.name,null)})),r=t.map((function(t){return e.createUserObj(t.athleteID,t.name,"this month")})).map((function(t){return e.calculateTotalPercent(t)})),s=b.a.orderBy(r,["totalPercentage"],["desc"]),c=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"][(new Date).getMonth()];return i.a.createElement("div",null,i.a.createElement("h2",{className:"myHeading"},i.a.createElement("a",{className:"rajbar-link",href:"https://raj.bar"},"raj.Bar")," ",i.a.createElement("span",{onClick:function(){return e.competitionSetter()}},"/ strava")),this.state.competition?i.a.createElement("div",null,i.a.createElement("h4",null,"Jan - ",c," Competition"),i.a.createElement(S,{allRows:s,thisMonth:c,competitionDistance:this.state.competitionDistance})):i.a.createElement(g,{allRows:a,orderedRows:n}))}}]),n}(n.Component)),C=function(e){Object(u.a)(a,e);var t=Object(o.a)(a);function a(){return Object(c.a)(this,a),t.apply(this,arguments)}return Object(l.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{className:"App"},i.a.createElement(j,null))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(C,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[18,1,2]]]);
//# sourceMappingURL=main.64ef9daa.chunk.js.map