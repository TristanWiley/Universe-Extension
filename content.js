chrome.storage.sync.get('gameInProgress', function (item) {
    if (item.gameInProgress == true) {
        $('#mw-head').remove();
        $(".portal").remove();
        $('#catlinks').click(function (e) {
            e.preventDefault();
        });
        displayScoreboard();
    }
});

//Detect player win
chrome.storage.sync.get('endPageTitle', function (item) {
    if (item.endPageTitle == $("#firstHeading").text()) {
        overlayConfetti();
    }
});

chrome.runtime.sendMessage({
    type: "add_page", page: $("#firstHeading").text()
});
console.log($("#firstHeading").text());

/* Listener for dialog stuff
 * When the inputs change and the start or end page change, do something.
 * if startPage changes, confirm they want to and change the page.
 * if endPage changes 
 */
chrome.storage.onChanged.addListener(function (changes) {
    console.log(changes["startPage"]);
    for (key in changes) {
        if (key == "endPageTitle") {
            var notifMessage = "You are now going to " + changes[key].newValue;

            chrome.runtime.sendMessage({
                type: "send_notification", options: {
                    type: "basic",
                    iconUrl: "https://en.wikipedia.org/static/images/project-logos/enwiki.png",
                    title: "The end page has been changed.",
                    message: notifMessage
                }
            });
        }
    }
});

function displayScoreboard() {
    chrome.storage.sync.get('userName', function (name) {
        fetch('https://cors.now.sh/http://universe-game.v6p2dfukmp.us-east-1.elasticbeanstalk.com/api/get_current_game').then(res => res.json())
            .then(res => {
                var json = res.status
                var players = json.players;
                $("#mw-panel").append("<br><br><h4>Current Pages: " + json.players[name.userName].length + "</h4>");
                $('#mw-head-base').append("<marquee id='playersMarquee'></marquee>");
                for(key of Object.keys(players)) {
                    var entries = players[key];
                    console.log(entries);
                    $('#playersMarquee').append(key + " is on page <span style=\"text-decoration=underlined;text-decoration: underline;\">" + entries[entries.length-1] + "</span>     |     ");
                }
            });
    });
}

function overlayConfetti() {
    alert("WIN");
    // document.body.innerHTML += '<script>var retina=window.devicePixelRatio,PI=Math.PI,sqrt=Math.sqrt,round=Math.round,random=Math.random,cos=Math.cos,sin=Math.sin,rAF=window.requestAnimationFrame,cAF=window.cancelAnimationFrame||window.cancelRequestAnimationFrame,_now=Date.now||function(){return(new Date).getTime()};!function(t){var i=_now(),s=t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.clearTimeout;rAF=t.requestAnimationFrame||t.webkitRequestAnimationFrame||function(t){var s=_now(),n=Math.max(0,16-(s-i)),o=setTimeout(t,n);return i=s,o},cAF=function(i){s.call(t,i)}}(window),document.addEventListener("DOMContentLoaded",function(){function t(i,s){this.x=i,this.y=s,this.Length=function(){return sqrt(this.SqrLength())},this.SqrLength=function(){return this.x*this.x+this.y*this.y},this.Add=function(t){this.x+=t.x,this.y+=t.y},this.Sub=function(t){this.x-=t.x,this.y-=t.y},this.Div=function(t){this.x/=t,this.y/=t},this.Mul=function(t){this.x*=t,this.y*=t},this.Normalize=function(){var t=this.SqrLength();if(0!=t){var i=1/sqrt(t);this.x*=i,this.y*=i}},this.Normalized=function(){var i=this.SqrLength();if(0!=i){var s=1/sqrt(i);return new t(this.x*s,this.y*s)}return new t(0,0)}}function i(i,s,n,o){this.position=new t(i,s),this.mass=n,this.drag=o,this.force=new t(0,0),this.velocity=new t(0,0),this.AddForce=function(t){this.force.Add(t)},this.Integrate=function(i){var s=this.CurrentForce(this.position);s.Div(this.mass);var n=new t(this.velocity.x,this.velocity.y);n.Mul(i),this.position.Add(n),s.Mul(i),this.velocity.Add(s),this.force=new t(0,0)},this.CurrentForce=function(i,s){var n=new t(this.force.x,this.force.y),o=this.velocity.Length(),e=new t(this.velocity.x,this.velocity.y);return e.Mul(this.drag*this.mass*o),n.Sub(e),n}}function s(i,n){this.pos=new t(i,n),this.rotationSpeed=600*random()+800,this.angle=o*random()*360,this.rotation=o*random()*360,this.cosA=1,this.size=5,this.oscillationSpeed=1.5*random()+.5,this.xSpeed=40,this.ySpeed=60*random()+50,this.corners=new Array,this.time=random();var r=round(random()*(e.length-1));this.frontColor=e[r][0],this.backColor=e[r][1];for(var a=0;a<4;a++){var h=cos(this.angle+o*(90*a+45)),c=sin(this.angle+o*(90*a+45));this.corners[a]=new t(h,c)}this.Update=function(t){this.time+=t,this.rotation+=this.rotationSpeed*t,this.cosA=cos(o*this.rotation),this.pos.x+=cos(this.time*this.oscillationSpeed)*this.xSpeed*t,this.pos.y+=this.ySpeed*t,this.pos.y>s.bounds.y&&(this.pos.x=random()*s.bounds.x,this.pos.y=0)},this.Draw=function(t){this.cosA>0?t.fillStyle=this.frontColor:t.fillStyle=this.backColor,t.beginPath(),t.moveTo((this.pos.x+this.corners[0].x*this.size)*retina,(this.pos.y+this.corners[0].y*this.size*this.cosA)*retina);for(var i=1;i<4;i++)t.lineTo((this.pos.x+this.corners[i].x*this.size)*retina,(this.pos.y+this.corners[i].y*this.size*this.cosA)*retina);t.closePath(),t.fill()}}function n(s,r,a,h,c,l,p,d){this.particleDist=h,this.particleCount=a,this.particleMass=p,this.particleDrag=d,this.particles=new Array;var u=round(random()*(e.length-1));this.frontColor=e[u][0],this.backColor=e[u][1],this.xOff=cos(o*l)*c,this.yOff=sin(o*l)*c,this.position=new t(s,r),this.prevPosition=new t(s,r),this.velocityInherit=2*random()+4,this.time=100*random(),this.oscillationSpeed=2*random()+2,this.oscillationDistance=40*random()+40,this.ySpeed=40*random()+80;for(var y=0;y<this.particleCount;y++)this.particles[y]=new i(s,r-y*this.particleDist,this.particleMass,this.particleDrag);this.Update=function(i){var s=0;this.time+=i*this.oscillationSpeed,this.position.y+=this.ySpeed*i,this.position.x+=cos(this.time)*this.oscillationDistance*i,this.particles[0].position=this.position;var o=this.prevPosition.x-this.position.x,e=this.prevPosition.y-this.position.y,r=sqrt(o*o+e*e);for(this.prevPosition=new t(this.position.x,this.position.y),s=1;s<this.particleCount;s++){var a=t.Sub(this.particles[s-1].position,this.particles[s].position);a.Normalize(),a.Mul(r/i*this.velocityInherit),this.particles[s].AddForce(a)}for(s=1;s<this.particleCount;s++)this.particles[s].Integrate(i);for(s=1;s<this.particleCount;s++){var h=new t(this.particles[s].position.x,this.particles[s].position.y);h.Sub(this.particles[s-1].position),h.Normalize(),h.Mul(this.particleDist),h.Add(this.particles[s-1].position),this.particles[s].position=h}this.position.y>n.bounds.y+this.particleDist*this.particleCount&&this.Reset()},this.Reset=function(){this.position.y=-random()*n.bounds.y,this.position.x=random()*n.bounds.x,this.prevPosition=new t(this.position.x,this.position.y),this.velocityInherit=2*random()+4,this.time=100*random(),this.oscillationSpeed=2*random()+1.5,this.oscillationDistance=40*random()+40,this.ySpeed=40*random()+80;var s=round(random()*(e.length-1));this.frontColor=e[s][0],this.backColor=e[s][1],this.particles=new Array;for(var o=0;o<this.particleCount;o++)this.particles[o]=new i(this.position.x,this.position.y-o*this.particleDist,this.particleMass,this.particleDrag)},this.Draw=function(i){for(var s=0;s<this.particleCount-1;s++){var n=new t(this.particles[s].position.x+this.xOff,this.particles[s].position.y+this.yOff),o=new t(this.particles[s+1].position.x+this.xOff,this.particles[s+1].position.y+this.yOff);this.Side(this.particles[s].position.x,this.particles[s].position.y,this.particles[s+1].position.x,this.particles[s+1].position.y,o.x,o.y)<0?(i.fillStyle=this.frontColor,i.strokeStyle=this.frontColor):(i.fillStyle=this.backColor,i.strokeStyle=this.backColor),0==s?(i.beginPath(),i.moveTo(this.particles[s].position.x*retina,this.particles[s].position.y*retina),i.lineTo(this.particles[s+1].position.x*retina,this.particles[s+1].position.y*retina),i.lineTo(.5*(this.particles[s+1].position.x+o.x)*retina,.5*(this.particles[s+1].position.y+o.y)*retina),i.closePath(),i.stroke(),i.fill(),i.beginPath(),i.moveTo(o.x*retina,o.y*retina),i.lineTo(n.x*retina,n.y*retina),i.lineTo(.5*(this.particles[s+1].position.x+o.x)*retina,.5*(this.particles[s+1].position.y+o.y)*retina),i.closePath(),i.stroke(),i.fill()):s==this.particleCount-2?(i.beginPath(),i.moveTo(this.particles[s].position.x*retina,this.particles[s].position.y*retina),i.lineTo(this.particles[s+1].position.x*retina,this.particles[s+1].position.y*retina),i.lineTo(.5*(this.particles[s].position.x+n.x)*retina,.5*(this.particles[s].position.y+n.y)*retina),i.closePath(),i.stroke(),i.fill(),i.beginPath(),i.moveTo(o.x*retina,o.y*retina),i.lineTo(n.x*retina,n.y*retina),i.lineTo(.5*(this.particles[s].position.x+n.x)*retina,.5*(this.particles[s].position.y+n.y)*retina),i.closePath(),i.stroke(),i.fill()):(i.beginPath(),i.moveTo(this.particles[s].position.x*retina,this.particles[s].position.y*retina),i.lineTo(this.particles[s+1].position.x*retina,this.particles[s+1].position.y*retina),i.lineTo(o.x*retina,o.y*retina),i.lineTo(n.x*retina,n.y*retina),i.closePath(),i.stroke(),i.fill())}},this.Side=function(t,i,s,n,o,e){return(t-s)*(e-n)-(i-n)*(o-s)}}var o=PI/180,e=[["#df0049","#660671"],["#00e857","#005291"],["#2bebbc","#05798a"],["#ffd200","#b06c00"]];t.Lerp=function(i,s,n){return new t((s.x-i.x)*n+i.x,(s.y-i.y)*n+i.y)},t.Distance=function(i,s){return sqrt(t.SqrDistance(i,s))},t.SqrDistance=function(t,i){var s=t.x-i.x,n=t.y-i.y;return s*s+n*n+z*z},t.Scale=function(i,s){return new t(i.x*s.x,i.y*s.y)},t.Min=function(i,s){return new t(Math.min(i.x,s.x),Math.min(i.y,s.y))},t.Max=function(i,s){return new t(Math.max(i.x,s.x),Math.max(i.y,s.y))},t.ClampMagnitude=function(i,s){var n=i.Normalized;return new t(n.x*s,n.y*s)},t.Sub=function(i,s){return new t(i.x-s.x,i.y-s.y,i.z-s.z)},s.bounds=new t(0,0),n.bounds=new t(0,0),(r={}).Context=function(i){var o=0,e=document.getElementById(i),a=e.parentNode,h=a.offsetWidth,c=a.offsetHeight;e.width=h*retina,e.height=c*retina;var l=e.getContext("2d"),p=new Array;for(n.bounds=new t(h,c),o=0;o<11;o++)p[o]=new n(random()*h,-random()*c*2,30,8,8,45,1,.05);var d=new Array;for(s.bounds=new t(h,c),o=0;o<95;o++)d[o]=new s(random()*h,random()*c);this.resize=function(){h=a.offsetWidth,c=a.offsetHeight,e.width=h*retina,e.height=c*retina,s.bounds=new t(h,c),n.bounds=new t(h,c)},this.start=function(){this.stop();this.update()},this.stop=function(){cAF(this.interval)},this.update=function(){var t=0;for(l.clearRect(0,0,e.width,e.height),t=0;t<95;t++)d[t].Update(.02),d[t].Draw(l);for(t=0;t<11;t++)p[t].Update(.02),p[t].Draw(l);this.interval=rAF(function(){r.update()})}};var r=new r.Context("confetti");r.start(),window.addEventListener("resize",function(t){r.resize()})});</script>'
    // $('body').prepend("<canvas height='1' id='confetti' width='1'></canvas>")
}

// //Get title from Wikipedia url
// function getTitle(url) {
//     return url.split("/wiki/")[1].replace(/_/g, " ");
// }