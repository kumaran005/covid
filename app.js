var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'covid'
});

conn.connect((err,connection) =>{
    if(err)
        console.error('something went wrong..!');
    if(connection)
       
        console.log('connected')
    return;
})

app.get('/',(req,res)=>{
    res.sendFile('view/form.html',{root:__dirname});
});




app.post('/submit',(req,res)=>{
    // console.log(req.body.patient_name);
    console.log(req.body.patient_age);

    var x = Math.floor(Math.random()*1E16)
    // patient

    var patient_id = x;
    var patient_name = req.body.patient_name;
    var patient_age = req.body.patient_age;
    var patient_aadhaar = req.body.patient_aadhaar;
    var patient_gender = req.body.male;
    var patient_address = req.body.patient_address;
    var patient_phno = req.body.patient_phno;
    
    // attendar

    var attendar_name = req.body.attendar_name;
    var attendar_aadhaar = req.body.attendar_aadhaar;
    var ref_doctor = req.body.ref_doctor;
    var attendar_phno = req.body.attendar_phno;

    // medicine

    var ct_scan_id = req.body.ct_scan_id;
    var ct_scan_centre = req.body.ct_scan_centre;
    var pcr_icmr = req.body.pcr_icmr;
    var receipt_no = req.body.receipt_no;

    var sql = `SELECT COUNT(*) as aadhaar FROM covid.patient WHERE patient_aadhaar = "${patient_aadhaar}"`;

    console.log("aadhaar:"+patient_aadhaar);
    conn.query(sql,(err,result)=>{

        console.log("Total Records:- " + result[0].aadhaar);

        if(result[0].aadhaar > 0){
            console.log("Aadhaar already exists");
        }

        else
        
        {

            var sql = "INSERT INTO `covid`.`patient`(`patient_id`,`patient_name`,`patient_age`,`patient_aadhaar`,`patient_gender`,`patient_address`,`patient_phno`) VALUES ('" + patient_id + "','" + patient_name + "','" + patient_age + "','" + patient_aadhaar + "','" + patient_gender + "','" + patient_address + "','" + patient_phno + "')";
                conn.query(sql,(err, result) => {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.end();
                 });
            var sql = "INSERT INTO `covid`.`attendar`(`patient_id`,`attendar_name`,`attendar_aadhaar`,`ref_doctor`,`attendar_phno`) VALUES('"+patient_id+"','"+attendar_name+"','"+attendar_aadhaar+"','"+ref_doctor+"','"+attendar_phno+"')";
                conn.query(sql,(err,result)=>{
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.end();
                });
            var sql = "INSERT INTO `covid`.`medicine`(`patient_id`,`ct_scan_id`,`ct_scan_centre`,`pcr_icmr`,`receipt_no`) VALUES('"+patient_id+"','"+ct_scan_id+"','"+ct_scan_centre+"','"+pcr_icmr+"','"+receipt_no+"')";
                conn.query(sql,(err,result)=>{   
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.end();
                });
    
            }
            
    })
    
   


    // var sql = "INSERT INTO `covid`.`patient`(`patient_id`,`patient_name`,`patient_age`,`patient_aadhaar`) VALUES ('" + patient_id + "','" + patient_name + "','" + patient_age + "','" + patient_aadhaar + "')";
    // conn.query(sql,(err,data)=>{
    //     res.render('form.html',{userdata:data});
    // });

});


app.listen(8080,()=>{
    console.log('server on 8080')
});