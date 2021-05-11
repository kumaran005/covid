var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'html');
app.set('view',__dirname);
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
    
    var x = Math.floor(Math.random()*1E16)
    //date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = mm + '/' + dd + '/' + yyyy;
    // console.log(today);

   // patient
  
    var patient_name = req.body.patient_name;
    var patient_id = x;
    var patient_age = req.body.patient_age;
    var patient_aadhaar = req.body.patient_aadhaar;
    var patient_gender = req.body.patient_gender;
    var patient_address = req.body.patient_address;
    var patient_phno = req.body.patient_phno;

    // console.log("name"+patient_name);
    // console.log("id"+patient_id);
    
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

    
    // console.log('gender'+patient_gender);

 

    var sql = `SELECT COUNT(*) as aadhaar FROM covid.patient WHERE patient_aadhaar = "${patient_aadhaar}"`;

    // console.log("aadhaar:"+patient_aadhaar);
    
    conn.query(sql,(err,result)=>{
        var message = '';

        console.log("Total Records:- " + result[0].aadhaar);

        if(result[0].aadhaar > 0)
        {
            console.log("Aadhaar already exists");
            check = (req,res)=>{
                message = "Data Already exists ";
                // res.render(__dirname + "view/form.html",{message:message});
                res.sendFile('view/form.html',{root:__dirname,message:message});
            };
        }

        else
        
        {

            var sql = "INSERT INTO `covid`.`patient`(`patient_id`,`patient_name`,`patient_age`,`patient_aadhaar`,`patient_gender`,`patient_address`,`patient_phno`,`date`) VALUES ('" + patient_id + "','" + patient_name + "','" + patient_age + "','" + patient_aadhaar + "','" + patient_gender + "','" + patient_address + "','" + patient_phno + "','"+today+"')";
                conn.query(sql,(err, data) => {
                    
                    var sql = "INSERT INTO `covid`.`attendar`(`patient_id`,`attendar_name`,`attendar_aadhaar`,`ref_doctor`,`attendar_phno`,`date`) VALUES('"+patient_id+"','"+attendar_name+"','"+attendar_aadhaar+"','"+ref_doctor+"','"+attendar_phno+"','"+today+"')";
                        conn.query(sql,(err,data)=>{                
                            
                            var sql = "INSERT INTO `covid`.`medicine`(`patient_id`,`ct_scan_id`,`ct_scan_centre`,`pcr_icmr`,`receipt_no`,`date`) VALUES('"+patient_id+"','"+ct_scan_id+"','"+ct_scan_centre+"','"+pcr_icmr+"','"+receipt_no+"','"+today+"')";
                                conn.query(sql,(err,data)=>{   

                                    message = "Successfully Submitted!";
                                    // res.render(__dirname +'form.html',{ message, userData: data });
                                    res.sendFile('view/form.html',{root:__dirname,message:message});
                                    
                                });
                      
                        });
                  
                });
       
        }
            
    });

});


app.listen(80,()=>{
    console.log('server on 80')
});

