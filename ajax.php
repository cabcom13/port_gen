<?php

if(isset($_GET['action']) && !empty($_GET['action'])) {
  $action = $_GET['action'];
   switch($action) {
       case 'get_background_images' : get_background_images();break;
       case 'get_border_images' : get_border_images();break;
       case 'get_projects' : get_projects();break;

   }
}


function get_projects(){

  $path = 'projects'; // '.' for current
  $data = array();
  foreach (new DirectoryIterator($path) as $file) {
      if ($file->isDot()) continue;

      if ($file->isDir()) {
            $pagedata = array();
            $dirname = $path.'/'.$file->getFilename();
            $images = scandir($dirname);
            $ignore = Array(".", "..");
            foreach($images as $curimg){
                if(!in_array($curimg, $ignore)) {
                 array_push($pagedata, array(
                   'name' => $curimg,
                   'data'=> json_decode(file_get_contents($path.'/'.$file->getFilename().'/'.$curimg))
                 ));
                }
            }
          array_push($data,array(
            'name' => $file->getFilename(),
            'path' => $path.'/'.$file->getFilename().'/',
            'pages' => $pagedata

          ));
      }
  }
  header('Content-Type: application/json');
  echo json_encode($data);
}

function get_border_images(){

  $data = array();
  $dirname = "img/border";
  $data = array('<option data-img-src="'.$dirname.'/no.png" value="no.png">'.preg_replace('/\\.[^.\\s]{3,4}$/', '', 'no.png').'</option>');
  $images = scandir($dirname);
  $ignore = Array(".", "..", 'no.png');
  foreach($images as $curimg){
      if(!in_array($curimg, $ignore)) {
        array_push($data, htmlspecialchars_decode('<option data-img-src="'.$dirname.'/'.$curimg.'" value="'.$curimg.'">'.preg_replace('/\\.[^.\\s]{3,4}$/', '', $curimg).'</option>'));
      }
  }

  header('Content-Type: application/json');
  echo json_encode($data);

}

function get_background_images(){
  $dirname = "img/bg";
  $data = array('<option data-img-src="'.$dirname.'/no.png" value="no.png">'.preg_replace('/\\.[^.\\s]{3,4}$/', '', 'no.png').'</option>');

  $images = scandir($dirname);
  $ignore = Array(".", "..", 'no.png');
  foreach($images as $curimg){
      if(!in_array($curimg, $ignore)) {
        array_push($data, htmlspecialchars_decode('<option data-img-src="'.$dirname.'/'.$curimg.'" value="'.$curimg.'">'.preg_replace('/\\.[^.\\s]{3,4}$/', '', $curimg).'</option>'));
      }
  }

  header('Content-Type: application/json');
  echo json_encode($data);

}
?>
