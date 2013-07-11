<?php
error_reporting(0);
define('ROOT',dirname(__FILE__));

require_once('db.php');
$db = new DB();

$op = $_GET['op'];
if($op == 'upload'){
    if(count($_POST)>0){
        
        $sex = $_POST['sex'];
        $from = $_POST['type']; //eg: mobile,pc,pad.
        
        
        if (empty($_POST['image'])) {
            $image = $GLOBALS[HTTP_RAW_POST_DATA];
            if(empty($data)){ 
                $image=file_get_contents("php://input");
            }
        }else{
            $pic = $_POST['image'];
            $image = str_replace(' ', '+', $pic);
            $image = base64_decode(str_replace('data:image/png;base64,', '',$image));
        }
        
        if(!empty($pic)){
            $path = './uploads/'.date('Y').'/'.date('m').'/'.date('d');
            if(!is_dir($path)){
                @mkdir($path,0777,true);
            }
            $filename = date('Ymd',time()).substr(md5(time()),8,16).'-'.$uid.'.png';
            $fp = fopen($path.'/'.$filename, 'w');
            fwrite($fp, $image);
            fclose($fp);
        
        
            //图片
            $sql = "INSERT INTO image (`type`,`sex`,`path`,`createtime`) VALUES ('$from','$sex','$filename','".time()."');";
            $res = $db->insert($sql);
        
        }
        
        if($res)
        echo json_encode(array('error_msg'=>'','status'=>'success','data'=>array('uid'=>$res,'mid'=>1,'similar'=>0.55)));
        setcookie('luxgenuser',$res,time()+86400*365);
        
    }else{
        echo json_encode(array('error_msg'=>'上传失败','status'=>'error','data'=>''));
    }
}elseif ($op == 'profile'){
    
    if(isset($_POST)){
        
        $uid = $_REQUEST['uid'];
        $name = $_POST['name'];
        $mobile = $_POST['mobile'];
        $province = $_POST['province'];
        $city = $_POST['city'];
        
        $sql = "SELECT COUNT(*) as num FROM user WHERE uid='$uid';";
        $rows = $db->select($sql);        
        if($rows[0]['num']>0){
             $sql = "INSERT INTO user (`uid`,`name`,`mobile`,`province`,`city`,`default`) VALUES ('$uid','$name','$mobile','$province','$city',0);";
        }else{
             $sql = "INSERT INTO user (`uid`,`name`,`mobile`,`province`,`city`,`default`) VALUES ('$uid','$name','$mobile','$province','$city',1);";
        }
       
        $db->insert($sql);
        echo json_encode(array('error_msg'=>'成功','status'=>'success','data'=>''));
        
    }else{
        
        echo json_encode(array('error_msg'=>'失败','status'=>'error','data'=>''));
        
    }
}elseif ($op == 'share'){
    if(count($_POST)>0)
    {
        $title = '纳智捷Luxgen';
        $content = '纳智捷Luxgen';
        $pic = '';
        $url = 'http://mobile.dfyl-luxgen.com';
        
        $uid = $_POST['uid'];
        $from = $_POST['type'];
        $platform = $_POST['platform'];
        
        $sql = "INSERT INTO share (`uid`,`platform`) VALUES ('$uid','$platform');";
        $db->insert($sql);
        
        switch ($platform)
        {
            case 'qq':
                $shareurl = 'http://share.v.t.qq.com/index.php?c=share&a=index&url='.$url.'&title='.$title.'&pic='.$pic.'&appkey=801cf76d3cfc44ada52ec13114e84a96';
                break;
            case 'sina':
                $shareurl = 'http://service.weibo.com/share/share.php?title='.$title.$content.'&url='.$url.'&source=bookmark&appkey=1995346682&pic='.$pic.'&ralateUid=';
                break;
            case 'renren':
                $shareurl = 'http://widget.renren.com/dialog/share?resourceUrl='.$url.'&srcUrl='.$url.'&title='.$title.'&description='.$content.'&pic='.$pic;
                break;
        }
        
         if($res){
            echo json_encode(array('error_msg'=>'成功','status'=>'success','data'=>array('shareurl'=>$shareurl)));
        }
    }else{
        
         echo json_encode(array('error_msg'=>'失败','status'=>'error','data'=>''));
    }
}

?>
