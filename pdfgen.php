<?php
require_once __DIR__ . '/vendor/autoload.php';


$data = file_get_contents('php://input');
#$data = base64_encode(preg_replace('#^data:image/\w+;base64,#i', '', $data));
$img = str_replace('data:image/png;base64,', '', $data);
$filename = 'gen_'.time();
if(file_put_contents('img/'.$filename.'.png', base64_decode($img))){
  #echo $filename;
  $mpdf = new mPDF();
  // Write some HTML code:
  $mpdf->WriteHTML('<style>@page{margin:0;}</style><div style="background:url(img/'.$filename.'.png'.') no-repeat 0 0; height:297mm; width:210mm;"></div>');
  // Output a PDF file directly to the browser
  $mpdf->Output('pdf/'.$filename.'.pdf', 'F');
  unlink('img/'.$filename.'.png');


  $files_to_zip = array(
    'pdf/'.$filename.'.pdf'

);
//if true, good; if false, zip creation failed
$result = create_zip($files_to_zip,'my-archive.zip');

  echo $filename;
} else {
  echo 'error';
}





function create_zip($files = array(),$destination = '',$overwrite = false) {
	//if the zip file already exists and overwrite is false, return false
	if(file_exists($destination) && !$overwrite) { return false; }
	//vars
	$valid_files = array();
	//if files were passed in...
	if(is_array($files)) {
		//cycle through each file
		foreach($files as $file) {
			//make sure the file exists
			if(file_exists($file)) {
				$valid_files[] = $file;
			}
		}
	}
	//if we have good files...
	if(count($valid_files)) {
		//create the archive
		$zip = new ZipArchive();
		if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
			return false;
		}
		//add the files
		foreach($valid_files as $file) {
			$zip->addFile($file,$file);
		}
		//debug
		//echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;

		//close the zip -- done!
		$zip->close();

		//check to make sure the file exists
		return file_exists($destination);
	}
	else
	{
		return false;
	}
}

 ?>
