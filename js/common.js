
function showFrame(framename) {
  if(!framename){ framename = 'homepage'}
  $('.frame').hide();
  if(framename !=='homepage' ){ $('.link_home').show();} else {$('.link_home').show();};
  $('.' + framename ).show();
  setTimeout(function(){window.scrollTo(0, 0);}, 0);
}

function showSubFrame(framename,subframename) {
  if(!framename && !subframename) {return false;};
  showFrame(framename);
  $('.' + framename + ' .subframe').hide();
  $('.' + framename + ' .' + subframename).show();
}

function showNavBar(barname) {
  if(!barname){ $('.navbar').hide();}
  $('.navbar').hide();
  $('.navbox').show();
  $('.' + barname ).show();
  //check nav bar prostion;
}

function gotPic(event) {
  if(event.target.files.length == 1 && 
    event.target.files[0].type.indexOf("image/") == 0) {
    $("#yourimage").attr("src",URL.createObjectURL(event.target.files[0]));
    showNavBar('retakepic');
  }
}

function postThePic(event) {
  //alert("postThePic OK!");
  router.navigate('yourmount/take');
  showSubFrame('yourmount','rendering');
  showNavBar('take');
  console.log('postThePic OK!');
}

function drowMout(mountid) {
  var scale = 2
  , stage = new Kinetic.Stage({
    container: 'container',
    width: 300,
    height: 280
  });
  var stage = new Kinetic.Stage({
    container: 'container',
    width: 300,
    height: 280
  });
  var staticLayer = new Kinetic.Layer();
  var staticGroup = new Kinetic.Group({
    x: 0,
    y: 0,
    rotationDeg: 0
  });
  var animLayer = new Kinetic.Layer();
  var animGroup = new Kinetic.Group({
    x: 0,
    y: 0,
    rotationDeg: 0
  });
  /*drow*/
  if(!mountid){ mountid = 1;};
  for (var i=0; i<mounts.length; i++) {
    if (mounts[i].mid == mountid ){
      /*drow point*/
      var pointArr = mounts[i].points;
      for (var n=0; n<pointArr.length; n++) {
        //console.log(pointArr[n].ox + ","+ pointArr[n].oy);
        (function() {
          var k = n;
          var newPoint = new Kinetic.Circle({
            x: pointArr[k].ox/scale,
            y: pointArr[k].oy/scale,
            radius: 2,
            fillRGB: {r:230,g:230,b:230},
            shadowColorRGB: {r:255,g:255,b:255},
            shadowBlur: 4,
            strokeWidth: 0
          });
          if(mounts[i].type=="off"){
            staticGroup.add(newPoint);
          }else{
            animGroup.add(newPoint);
          }
        })();
      }
      /*drow line*/
      var linesArr =  mounts[i].lines;
      for (var n=0; n<linesArr.length; n++) {
        var strPoint = linesArr[n].strpid-1
        , endPoint = linesArr[n].endpid-1
        , PointX1 = pointArr[strPoint].ox/scale
        , PointY1 = pointArr[strPoint].oy/scale
        , PointX2 = pointArr[endPoint].ox/scale
        , PointY2 = pointArr[endPoint].oy/scale;
        var line = new Kinetic.Line({
          x: 0,
          y: 0,
          id: "line"+n,
          points: [PointX1,PointY1,PointX2,PointY2],
          stroke: 'white',
          opacity:0.4
        });
        console.log("lines-" + n +"-type:" + linesArr[n].type);
          if(linesArr[n].type=="off"){
            staticGroup.add(line);
          }else{
            animGroup.add(line);
          }
      }
    }
    //console.log(mountid)
  }

  /*drow animtion*/

  var animLayer = new Kinetic.Layer();
  var anims = new Object();
  anims.a = 600;
  anims.b = 1;
  var anim = new Kinetic.Animation(function(frame) {
    /*remove animlayer*/
    animLayer.remove();
    animLayer = new Kinetic.Layer();

    console.log("frame:" + frame.timeDiff + ",frame.time :" + frame.time + ",anims.b:" + anims.b ) ;

    if ( frame.time > anims.a ) {
      anim.stop();
      //showSubFrame('yourmount','real');
      showNavBar('yourmount');
      //router.navigate('yourmount/real');
      $('.mountswich a').hide();
      $('.mountswich .nex').show();

    };
    anims.b++;
    stage.add(animLayer);
    //date1=new Date();
  }, animLayer);
  //console.log("staticGroup:" + staticGroup+"\n");
  staticLayer.add(staticGroup);
  stage.add(staticLayer);
  animLayer.add(animGroup);
  stage.add(animLayer);
  

  document.getElementById('start').addEventListener('click', function() {
    anim.start();
  }, false);
  
  document.getElementById('stop').addEventListener('click', function() {
    anim.stop();
  }, false);

} //drowMout finish;



var AppRouter = Backbone.Router.extend({  
    routes : {  
        '' : 'main', 
        'index' : 'main', 
        'gender' : 'selectGender',
        "gender/:user" : "selectGenderUser",
        'take' : 'takePic',  
        'take/:user' : 'takePic',
        'retake' : 'retakePic', 
        'share':'shareGame',
        'awardlist' : 'awardList',
        'subminsuccess':'subminSuccess',
        'aboutgame' : 'aboutGame',
        'yourmount' : 'yourMount',
        'yourmount/:step' : 'yourMount',
        '*error' : 'renderError'  
    },  
    main : function() {  
        console.log('homepage');
        showFrame('homepage');
        showNavBar();
    },  
    selectGender: function() {  
        console.log('selectGender');
        showFrame('selectgender');
        showNavBar();
    },
    selectGenderUser: function(user) {  
    	if(!user){ user = 'male'}
        console.log('性别为：' +user );
        router.navigate('take/' + user , {  
    		  trigger: true  
		    });
    },
    awardList: function() {  
        console.log('awardlist');
        showSubFrame('awardbox','inputfrom');
        showNavBar('awardlink');
    },
    subminSuccess: function() {  
        console.log('subminsuccess');
        showSubFrame('awardbox','subminsuccess');
        showNavBar('subminsuccess');
    },
    shareGame: function() {  
        console.log('shearGame');
        showSubFrame('awardbox','share');
        showNavBar('sheargame');
    },  
    aboutGame: function() {  
        console.log('aboutGame');
        showFrame('aboutgame');
    },  
    takePic : function(user) {  
    	if(!user){ user = 'male'}
      console.log('takePic 性别为：' +user);
    	showSubFrame('takebox','take');
      showNavBar('takepic');
    },  
    retakePic : function(id) {  
      console.log('渲染详情方法, id为: ' + id);  
    }, 
    yourMount : function(step) {  
    	if(!step){ user = 'take'}
        console.log('渲染详情方法, id为: ' + step);
        showFrame('yourmount');
        if(step == 'take'){
        	router.navigate('yourmount/' + step , {  
	    		  trigger: true  
          });
        	drowMout(1);
        }else if (step == 'real'){
          router.navigate('yourmount/real');
          showSubFrame('yourmount','real');
          showNavBar('submintinfo');
          $('.mountswich a').hide();
          $('.mountswich .pre').show();
      }
    }, 
    renderError : function(error) {  
        console.log('URL错误, 错误信息: ' + error); 
        $('.link_home').show(); 
    }  
});  
  

var router = new AppRouter();  
Backbone.history.start(); 

$(document).ready(function() {
  console.log('onReady');

  $('.takethepic').die('click').live('click',function(){
    $('#takePictureField').click();

    //$('#input1').val($('#myfile').val());
  });

	$("#takePictureField").on("change",gotPic);
  $(".retake").die('click').live('click',function(){
    postThePic();
  });

	//$("#yourimage").load(getSwatches);
	desiredWidth = window.innerWidth;
  if(!("url" in window) && ("webkitURL" in window)) {
      window.URL = window.webkitURL;   
  };
  $('.mountswich .pre').die('click').live('click',function(){
    showSubFrame('yourmount','rendering');
    router.navigate('yourmount/take');
    showNavBar('yourmount');
    $('.mountswich a').hide();
    //if 
    $('.mountswich .nex').show();
  });
  $('.mountswich .nex').die('click').live('click',function(){
    showSubFrame('yourmount','real');
    showNavBar('showreal');
    router.navigate('yourmount/real');
    $('.mountswich a').hide();
    $('.mountswich .pre').show();
  });

  $('.navbox .youreal').die('click').live('click',function(){
    showSubFrame('yourmount','real');
    showNavBar('showreal');
    router.navigate('yourmount/real');
    $('.mountswich a').hide();
    $('.mountswich .pre').show();

  });
});



