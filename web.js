const express=require("express");
const app=express();
const jquery=require("jquery");
const ejs = require("ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const https=require("https");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const mongoose=require("mongoose");
app.set('view engine', 'ejs');

var carbonFootprint1=0;
var carbonFootprint2=0;                     //variables to store result
var carbonFootprint3=0;
var carbonFootprint4=0;
var carbonFootprint12=0,carbonFootprint13=0,carbonFootprint14;
var carbonFootprintResult=0;
var carbonFootprint11=0;
var carbonFootprintResult1=0;
var b=0;
var flag=0;
var a="";

var motorDist=0;
var carsDist=0;
var flightDist=0;
var publicDist=0;
var _id="";
var cd=0,cf=0,ff=0,fd=0,md=0,mf=0,pd=0,pf=0;

// var md=0;

app.use(express.static("public"));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true

}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/usersData");
const MotorSchema=new mongoose.Schema({
name:String,
footprint:Number

});
const DataSchema=new mongoose.Schema({
  username: String,
  password: String,
  Car:{
    carType:String,
    distance:Number,
    fuel:Number,
    footprint:Number,
    carType2:String,
    distance2:Number,
    fuel2:Number,
    footprint2:Number,
    footprint1:Number
  },
  Flight:{
    flightType:String,
    distance:Number,
    footprint:Number,
    flightType2:String,
    distance2:Number,
    footprint1:Number,
    footprint2:Number
  },
  Public:{
    vehicleType:String,
    distance:Number,
    footprint:Number,
    vehicleType2:String,
    distance2:Number,
    footprint1:Number,
    footprint2:Number
  },
  Motor:{
    motorType:String,
    distance:Number,
    footprint:Number,
    motorType2:String,
    distance2:Number,
    footprint1:Number,
      footprint2:Number

  },
  Car1:{
    carType:String,
    distance:Number,
    fuel:Number,
    footprint:Number,
    carType2:String,
    distance2:Number,
    fuel2:Number,
    footprint2:Number,
    footprint1:Number

  },
  Flight1:{
    flightType:String,
    distance:Number,
    footprint:Number,
    flightType2:String,
    distance2:Number,
    footprint1:Number,
    footprint2:Number
  },
  Public1:{
    vehicleType:String,
    distance:Number,
    footprint:Number,
    vehicleType2:String,
    distance2:Number,
    footprint1:Number,
    footprint2:Number
  },
  Motor1:{
    motorType:String,
    distance:Number,
    footprint:Number,
    motorType2:String,
    distance2:Number,
    footprint1:Number,
      footprint2:Number
  },
  Result:{
    total:Number
  },
  Result1:{
    total:Number
  },
    entry:String
});

DataSchema.plugin(passportLocalMongoose);
MotorSchema.plugin(passportLocalMongoose);

const Data=new mongoose.model("Data",DataSchema);



const MotorData=new mongoose.model("MotorData",MotorSchema);


const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(Data.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////root and home routes /////////////////////////////////////////////////////////////////////////////

app.get("/starter",function(req,res){
  res.render("starter")
})

app.get("/",function(req,res){
  if(req.isAuthenticated()){
    Data.findOne({_id:_id},function(err,user){
        res.render("home",{sel:user.entry});
    })

  }
  else {
    res.render("starter");
  }

})

app.post("/entry",function(req,res){

var  entry=req.body.entry;
  console.log(entry);
  Data.findByIdAndUpdate(_id, { $set: { entry:entry }}, function(err){
    if(err){
      console.log(err);
    }
  })

  res.redirect("/CarTravel");
})

app.get("/home",function(req,res){


if(req.isAuthenticated()){
  Data.findOne({_id:_id},function(err,user){
      res.render("home",{sel:user.entry});
  })

}

else{

  res.render("starter");
}

})
app.get("/next",function(req,res){
  res.render("next");
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////cartravel/////////////////////////////////////////////////////////////////////////////

app.get("/CarTravel",function(req,res){

if(req.isAuthenticated()){

  Data.findOne({_id:_id}, function (err, user) {
    if(user.entry==="entry1"){
    cd=user.Car.distance;
    cfu=user.Car.fuel;
    cf=user.Car.footprint;
    var ct=user.Car.carType;
    cd2=user.Car.distance2;
    cfu2=user.Car.fuel2;
    var ct2=user.Car.carType2;


    }
    else{
    cd=user.Car1.distance;
    cfu=user.Car1.fuel;
    cf=user.Car1.footprint;
    var ct=user.Car1.carType;
    cd2=user.Car1.distance2;
    cfu2=user.Car1.fuel2;
    var ct2=user.Car1.carType2;
}
if(cf<=20 && cf>0){
  var statement="I’m like 97% of scientist myself, and I can’t deny … it’s getting hot in here.";
}
else if(cf>20&& cf<40){
  var statement="Love water not Oil";
}
  res.render("cars",{title:"Cars",carbon:cf,dist:cd,sel:ct,pie:cf,statement:statement,fuel:cfu,dist2:cd2,sel2:ct2,fuel2:cfu2});

  });
}



else{
  res.render("starter");
}


});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////cartravel clear/////////////////////////////////////////////////////////////////////////////


app.get("/CarTravelClear",function(req,res){

  const motor1={
    carType:"--Please choose an option--",
    distance:0,
    fuel:0,
    footprint:0,
    carType2:0,
    distance2:0,
    fuel2:0
  }

    Data.findOne({_id:_id}, function (err, user) {
  if(user.entry==="entry1"){
      carbonFootprintResult=carbonFootprintResult-carbonFootprint1;
      if(carbonFootprintResult<0){
        carbonFootprintResult=0;
      }
      const result={
      total:carbonFootprintResult
      }
        carbonFootprint1=0;



      Data.findByIdAndUpdate(_id, { $set: { Result:result }}, function(err){
        if(err){
          console.log(err);
        }
      })
      Data.findByIdAndUpdate(_id, { $set: { Car: motor1 }}, function(err){
        if(err){
          console.log(err);
        }

      })

    }
    else{
      carbonFootprintResult1=carbonFootprintResult1-carbonFootprint11;
      if(carbonFootprintResult1<0){
        carbonFootprintResult1=0;
      }
      const result={
      total:carbonFootprintResult1
      }
      carbonFootprint11=0;
      Data.findByIdAndUpdate(_id, { $set: { Result1:result }}, function(err){
        if(err){
          console.log(err);
        }
      })
      Data.findByIdAndUpdate(_id, { $set: { Car1: motor1 }}, function(err){
        if(err){
          console.log(err);
        }

      })
    }
  })





    res.render("cars",{title:"Cars",carbon:0,dist:0,sel:"--Please choose an option--",pie:cf,statement:"",fuel:0,dist2:0,sel2:"--Please choose an option--",fuel2:0});


});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////Flight /////////////////////////////////////////////////////////////////////////////

app.get("/Flight",function(req,res){
  if(req.isAuthenticated()){
    Data.findOne({_id:_id}, function (err, user) {
  if(user.entry==="entry1"){
      fd=user.Flight.distance;
      ff=user.Flight.footprint;
      ft=user.Flight.flightType;
    }
    else{
      fd=user.Flight1.distance;
      ff=user.Flight1.footprint;
      ft=user.Flight1.flightType;
    }
    if(ff<=20){
      var statement="I’m like 97% of scientist myself, and I can’t deny … it’s getting hot in here.";
    }
    else if(ff>20&& ff<40){
      var statement="Love water not Oil";
    }
        res.render("Flight",{title:"Flight",carbon:ff,dist:fd,sel:ft,statement:statement,pie:ff});
    });
  }
  else{
    res.render("starter");
  }                                                                                  //to render respective pages for specified routes

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////flight clear/////////////////////////////////////////////////////////////////////////////

app.get("/FlightClear",function(req,res){

    Data.findOne({_id:_id}, function (err, user) {
  if(user.entry==="entry1"){
  carbonFootprintResult-=carbonFootprint2;
  if(carbonFootprintResult<0){
    carbonFootprintResult=0;
  }
  const result={
  total:carbonFootprintResult
  }
  Data.findByIdAndUpdate(_id, { $set: { Result:result }}, function(err){
    if(err){
      console.log(err);
    }
  })

const motor1={
  flightType:"",
  distance:0,
  footprint:0
}


Data.findByIdAndUpdate(_id, { $set: { Flight: motor1 }}, function(err){
  if(err){
    console.log(err);
  }

})

}
else{
  carbonFootprintResult1-=carbonFootprint12;
  if(carbonFootprintResult1<0){
    carbonFootprintResult1=0;
  }
  const result={
  total:carbonFootprintResult1
  }
  Data.findByIdAndUpdate(_id, { $set: { Result1:result }}, function(err){
    if(err){
      console.log(err);
    }
  })

const motor1={
  flightType:"",
  distance:0,
  footprint:0
}


Data.findByIdAndUpdate(_id, { $set: { Flight1: motor1 }}, function(err){
  if(err){
    console.log(err);
  }

})
}
})

res.render("Flight",{title:"Flight",carbon:0,dist:0,sel:"--Please choose an option--",statement:"",pie:ff});
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////motorbike /////////////////////////////////////////////////////////////////////////////


app.get("/MotorBike",function(req,res){

  if(req.isAuthenticated()){
  Data.findOne({_id:_id}, function (err, user) {
    if(user.entry==="entry1"){
console.log(user.Motor.motorType);
    md=user.Motor.distance;
    mf=user.Motor.footprint;
   mt=user.Motor.motorType;
 }
 else{
   md=user.Motor1.distance;
   mf=user.Motor1.footprint;
  mt=user.Motor1.motorType;
 }
 if(mf<=20){
   var statement="I’m like 97% of scientist myself, and I can’t deny … it’s getting hot in here.";
 }
 else if(mf>20&& mf<40){
   var statement="Love water not Oil";
 }
      res.render("bike",{title:"MotorBike",carbon:mf,dist:md,sel:mt,statement:statement,pie:mf});
  });


  }
  else{
    res.render("starter");
  }


});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////motorbike clear/////////////////////////////////////////////////////////////////////////////

app.get("/MotorBikeClear",function(req,res){
  Data.findOne({_id:_id}, function (err, user) {
  if(user.entry==="entry1"){
  carbonFootprintResult-=carbonFootprint3;
  if(carbonFootprintResult<0){
    carbonFootprintResult=0;
  }
  const result={
  total:carbonFootprintResult
  }
  Data.findByIdAndUpdate(_id, { $set: { Result:result }}, function(err){
    if(err){
      console.log(err);
    }
  })

const motor1={
  motorType:"",
  distance:0,
  footprint:0
}


Data.findByIdAndUpdate(_id, { $set: { Motor: motor1 }}, function(err){
  if(err){
    console.log(err);
  }

})
}
else{
  carbonFootprintResult1-=carbonFootprint13;
  if(carbonFootprintResult1<0){
    carbonFootprintResult1=0;
  }
  const result={
  total:carbonFootprintResult
  }
  Data.findByIdAndUpdate(_id, { $set: { Result1:result }}, function(err){
    if(err){
      console.log(err);
    }
  })

const motor1={
  motorType:"",
  distance:0,
  footprint:0
}


Data.findByIdAndUpdate(_id, { $set: { Motor1: motor1 }}, function(err){
  if(err){
    console.log(err);
  }

})
}
})
res.render("bike",{title:"MotorBike",carbon:0,dist:0,sel:"--Please choose an option--",statement:"",pie:mf});

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////public /////////////////////////////////////////////////////////////////////////////

app.get("/PublicTransit",function(req,res){

  if(req.isAuthenticated()){
    Data.findOne({_id:_id}, function (err, user) {
if(user.entry==="entry1"){
      pd=user.Public.distance;
      pf=user.Public.footprint;
      pt=user.Public.vehicleType;
    }
    else{
      pd=user.Public1.distance;
      pf=user.Public1.footprint;
      pt=user.Public1.vehicleType;
    }
    if(pf<=20){
      var statement="I’m like 97% of scientist myself, and I can’t deny … it’s getting hot in here.";
    }
    else if(pf>20&& pf<40){
      var statement="Love water not Oil";
    }
    res.render("public",{title:"Public Transport",carbon:pf,dist:pd,sel:pt,statement:statement,pie:pf})
    });
  }
  else{
    res.render("starter");
  }


})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////public clear /////////////////////////////////////////////////////////////////////////////
app.get("/publicTransitClear",function(req,res){
  Data.findOne({_id:_id}, function (err, user) {
  if(user.entry==="entry1"){
  carbonFootprintResult-=carbonFootprint4;
  if(carbonFootprintResult<0){
    carbonFootprintResult=0;
  }
  const result={
  total:carbonFootprintResult
  }
  Data.findByIdAndUpdate(_id, { $set: { Result:result }}, function(err){
    if(err){
      console.log(err);
    }
  })

  const motor1={
    vehicleType:"",
    distance:0,
    footprint:0
  }


  Data.findByIdAndUpdate(_id, { $set: { Public: motor1 }}, function(err){
    if(err){
      console.log(err);
    }

  })
}
else{
  carbonFootprintResult1-=carbonFootprint14;
  if(carbonFootprintResult1<0){
    carbonFootprintResult1=0;
  }
  const result={
  total:carbonFootprintResult1
  }
  Data.findByIdAndUpdate(_id, { $set: { Result1:result }}, function(err){
    if(err){
      console.log(err);
    }
  })

  const motor1={
    vehicleType:"",
    distance:0,
    footprint:0
  }


  Data.findByIdAndUpdate(_id, { $set: { Public1: motor1 }}, function(err){
    if(err){
      console.log(err);
    }

  })
}
})
  res.render("public",{title:"Public Transport",carbon:0,dist:0,sel:"--Please choose an option--",statement:"",pie:ff})
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////results /////////////////////////////////////////////////////////////////////////////



app.get("/results",function(req,res){

// carbonFootprintResult=  Math.round(carbonFootprintResult * 100) / 100;
  if(req.isAuthenticated()){
Data.findOne({_id:_id}, function (err, user) {
if(user.entry=="entry1"){
  var Final=user.Result.total;
}
else{
  var Final=user.Result1.total;
}


res.render("results",{carbon:Final})
});
}
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////results2 /////////////////////////////////////////////////////////////////////////////
app.get("/results2",function(req,res){
  if(req.isAuthenticated()){
    Data.findOne({_id:_id}, function (err, user) {

      cd=user.Car.distance;
      cf=user.Car.footprint1/100;
      cfu=user.Car.fuel;
      var ct=user.Car.carType;
      cd2=user.Car.distance2;
      cf2=user.Car.footprint2/100;
      cfu2=user.Car.fuel2;
      var ct2=user.Car.carType2;


            fd=user.Flight.distance;
            ff=user.Flight.footprint/100;
            ft=user.Flight.flightType;

            md=user.Motor.distance;
            mf=user.Motor.footprint/100;
           mt=user.Motor.motorType;


            pd=user.Public.distance;
            pf=user.Public.footprint/100;
            pt=user.Public.vehicleType;

            var c=user.Result.total/100;

                    cd1=user.Car1.distance;
                    cf1=user.Car1.footprint1/100;
                    cfu1=user.Car1.fuel;
                    var ct1=user.Car1.carType;
                    cd22=user.Car1.distance2;
                    cf22=user.Car1.footprint2/100;
                    cfu22=user.Car1.fuel2;
                    var ct22=user.Car1.carType2;


                  fd1=user.Flight1.distance;
                  ff1=user.Flight1.footprint/100;
                  ft1=user.Flight1.flightType;

                  md1=user.Motor1.distance;
                  mf1=user.Motor1.footprint/100;
                 mt1=user.Motor1.motorType;


                  pd1=user.Public1.distance;
                  pf1=user.Public1.footprint/100;
                  pt1=user.Public1.vehicleType;

                  var c1=user.Result1.total/100;

      res.render("results2",{vehicle1:ct,distance1:cd,fuel1:cfu,vehicle21:ct2,distance22:cd2,fuel23:cfu2,footprint24:cf2,footprint1:cf,vehicle2:ft,distance2:fd,footprint2:ff,vehicle3:mt,distance3:md,footprint3:mf,vehicle4:pt,distance4:pd,footprint4:pf,carbon:c,vehicle11:ct1,distance11:cd1,fuel11:cfu1,footprint11:cf1,vehicle31:ct22,distance32:cd22,fuel33:cfu22,footprint34:cf22,vehicle12:ft1,distance12:fd1,footprint12:ff1,vehicle13:mt1,distance13:md1,footprint13:mf1,vehicle14:pt1,distance14:pd1,footprint14:pf1,carbon1:c1});
    });
  }
  else{
    res.render("starter");
  }


})

app.get("/results22",function(req,res){
  if(req.isAuthenticated()){
    Data.findOne({_id:_id}, function (err, user) {

      cd=user.Car.distance;
      cf=user.Car.footprint1;
      cfu=user.Car.fuel;
      var ct=user.Car.carType;
      cd11=user.Car.distance2;
      cf11=user.Car.footprint2;
      cfu11=user.Car.fuel2;
      var ct11=user.Car.carType2;



            fd=user.Flight.distance;
            ff=user.Flight.footprint;
            ft=user.Flight.flightType;

            md=user.Motor.distance;
            mf=user.Motor.footprint;
           mt=user.Motor.motorType;


            pd=user.Public.distance;
            pf=user.Public.footprint;
            pt=user.Public.vehicleType;

            var c=user.Result.total;

                    cd1=user.Car1.distance;
                    cf1=user.Car1.footprint1;
                    var ct1=user.Car1.carType;
                      cfu1=user.Car.fuel;

                      cd22=user.Car1.distance2;
                      cf22=user.Car1.footprint2;
                      cfu22=user.Car1.fuel2;
                      var ct22=user.Car1.carType2;


                  fd1=user.Flight1.distance;
                  ff1=user.Flight1.footprint;
                  ft1=user.Flight1.flightType;

                  md1=user.Motor1.distance;
                  mf1=user.Motor1.footprint;
                 mt1=user.Motor1.motorType;


                  pd1=user.Public1.distance;
                  pf1=user.Public1.footprint;
                  pt1=user.Public1.vehicleType;

                  var c1=user.Result1.total;

      res.render("results22",{vehicle1:ct,distance1:cd,fuel1:cfu,footprint1:cf,vehicle21:ct11,distance22:cd11,fuel23:cfu11,footprint24:cf11,vehicle2:ft,distance2:fd,footprint2:ff,vehicle3:mt,distance3:md,footprint3:mf,vehicle4:pt,distance4:pd,footprint4:pf,carbon:c,vehicle11:ct1,distance11:cd1,fuel11:cfu1,footprint11:cf1,vehicle31:ct22,distance32:cd22,fuel33:cfu22,footprint34:cf22,vehicle12:ft1,distance12:fd1,footprint12:ff1,vehicle13:mt1,distance13:md1,footprint13:mf1,vehicle14:pt1,distance14:pd1,footprint14:pf1,carbon1:c1});
    });
  }
  else{
    res.render("starter");
  }


})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////get routs starts /////////////////////////////////////////////////////////////////////////////
app.post("/results2",function(req,res){
  Data.findOne({_id:_id},function(err,user){
    if(user.entry==="entry1"){
        res.redirect("/results2");
    }
    else{
        res.redirect("/results22");
    }
  })


})
app.get("/reduce",function(req,res){
  res.render("reduce");
})

// app.get("/register",function(req,res){
// res.render("starter",{msgb:" ",msg:" "});
// })
// app.get("/login",function(req,res){
// res.render("starter",{msg:" ",msgb:" "});
// })

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////clear whole form /////////////////////////////////////////////////////////////////////////////

app.get("/clear",function(re,res){
  Data.findOne({_id:_id}, function (err, user) {
  if(user.entry==="entry1"){
carbonFootprintResult=0;
carbonFootprint1=0;
carbonFootprint2=0;
carbonFootprint3=0;
carbonFootprint4=0;

const result={
total:carbonFootprintResult
}
Data.findByIdAndUpdate(_id, { $set: { Result:result }}, function(err){
  if(err){
    console.log(err);
  }
})


const motor1={
  carType:"--Please choose an option--",
  distance:0,
  fuel:0,
  footprint:0,
  carType2:"--Please choose an option--",
  distance2:0,
  fuel2:0

}


Data.findByIdAndUpdate(_id, { $set: { Car: motor1 }}, function(err){
  if(err){
    console.log(err);
  }

})


  const motor2={
    motorType:"--Please choose an option--",
    distance:0,
    footprint:0
  }


  Data.findByIdAndUpdate(_id, { $set: { Motor: motor2 }}, function(err){
    if(err){
      console.log(err);
    }

  })

  const motor3={
    flightType:"--Please choose an option--",
    distance:0,
    footprint:0
  }


  Data.findByIdAndUpdate(_id, { $set: { Flight: motor3 }}, function(err){
    if(err){
      console.log(err);
    }

  })


  const motor4={
    vehicleType:"--Please choose an option--",
    distance:0,
    footprint:0
  }


  Data.findByIdAndUpdate(_id, { $set: { Public: motor4 }}, function(err){
    if(err){
      console.log(err);
    }

  })
}
else{
  carbonFootprintResult1=0;
carbonFootprint11=0;
carbonFootprint12=0;
carbonFootprint13=0;
carbonFootprint14=0;
  const result={
  total:carbonFootprintResult1
  }
  Data.findByIdAndUpdate(_id, { $set: { Result1:result }}, function(err){
    if(err){
      console.log(err);
    }
  })


  const motor1={
    carType:"--Please choose an option--",
    distance:0,
    fuel:0,
    footprint:0,
    carType2:"--Please choose an option--",
    distance2:0,
    fuel2:0

  }


  Data.findByIdAndUpdate(_id, { $set: { Car1: motor1 }}, function(err){
    if(err){
      console.log(err);
    }

  })


    const motor2={
      motorType:"--Please choose an option--",
      distance:0,
      footprint:0
    }


    Data.findByIdAndUpdate(_id, { $set: { Motor1: motor2 }}, function(err){
      if(err){
        console.log(err);
      }

    })

    const motor3={
      flightType:"--Please choose an option--",
      distance:0,
      footprint:0
    }


    Data.findByIdAndUpdate(_id, { $set: { Flight1: motor3 }}, function(err){
      if(err){
        console.log(err);
      }

    })


    const motor4={
      vehicleType:"--Please choose an option--",
      distance:0,
      footprint:0
    }


    Data.findByIdAndUpdate(_id, { $set: { Public1: motor4 }}, function(err){
      if(err){
        console.log(err);
      }

    })
}
})
res.redirect("/CarTravel");

})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////logout /////////////////////////////////////////////////////////////////////////////-
app.get("/logout", function (req, res){
  req.session.destroy(function (err) {
    res.render("starter"); //Inside a callback… bulletproof!
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////login /////////////////////////////////////////////////////////////////////////////

app.post("/login",function(req,res){

  const user=new Data({
    username:req.body.username,

  })

  passport.authenticate('local', function(err, user, info) {
   if (err) { return next(err); }
   if (!user) { res.render("starter")
    }
   req.logIn(user, function(err) {
     if (err) { return (err); }
     _id=user._id;
     return res.redirect("/home");
   });
 })(req, res);
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////register /////////////////////////////////////////////////////////////////////////////
app.post("/register",function(req,res){

  const user2=new Data({
    username:req.body.username,

  });
  Data.register(user2,req.body.password,function(err,user){
    if(err){
    res.render("starter");
    }
    else{
      passport.authenticate("local")(req,res,function(){
_id=user2._id;


        Data.findOne({_id:_id}, function (err, user) {

      carbonFootprintResult=0;

      const result={
      total:carbonFootprintResult
      }
      Data.findByIdAndUpdate(_id, { $set: { Result:result }}, function(err){
        if(err){
          console.log(err);
        }
      })


      const motor1={
        carType:"--Please choose an option--",
        distance:0,
        fuel:0,
        footprint:0,
        carType2:"--Please choose an option--",
        distance2:0,
        fuel2:0
      }


      Data.findByIdAndUpdate(_id, { $set: { Car: motor1 }}, function(err){
        if(err){
          console.log(err);
        }

      })


        const motor2={
          motorType:"--Please choose an option--",
          distance:0,
          footprint:0
        }


        Data.findByIdAndUpdate(_id, { $set: { Motor: motor2 }}, function(err){
          if(err){
            console.log(err);
          }

        })

        const motor3={
          flightType:"--Please choose an option--",
          distance:0,
          footprint:0
        }


        Data.findByIdAndUpdate(_id, { $set: { Flight: motor3 }}, function(err){
          if(err){
            console.log(err);
          }

        })


        const motor4={
          vehicleType:"--Please choose an option--",
          distance:0,
          footprint:0
        }


        Data.findByIdAndUpdate(_id, { $set: { Public: motor4 }}, function(err){
          if(err){
            console.log(err);
          }

        })


        carbonFootprintResult1=0;

        const resultInit={
        total:carbonFootprintResult1
        }
        Data.findByIdAndUpdate(_id, { $set: { Result1:resultInit }}, function(err){
          if(err){
            console.log(err);
          }
        })


        const motor1Init={
          carType:"--Please choose an option--",
          distance:0,
          fuel:0,
          footprint:0,
          carType2:"--Please choose an option--",
          distance2:0,
          fuel2:0
        }


        Data.findByIdAndUpdate(_id, { $set: { Car1: motor1Init }}, function(err){
          if(err){
            console.log(err);
          }

        })


          const motor2Init={
            motorType:"--Please choose an option--",
            distance:0,
            footprint:0
          }


          Data.findByIdAndUpdate(_id, { $set: { Motor1: motor2Init }}, function(err){
            if(err){
              console.log(err);
            }

          })

          const motor3Init={
            flightType:"--Please choose an option--",
            distance:0,
            footprint:0
          }


          Data.findByIdAndUpdate(_id, { $set: { Flight1: motor3Init }}, function(err){
            if(err){
              console.log(err);
            }

          })


          const motor4Init={
            vehicleType:"--Please choose an option--",
            distance:0,
            footprint:0
          }


          Data.findByIdAndUpdate(_id, { $set: { Public1: motor4Init }}, function(err){
            if(err){
              console.log(err);
            }

          })

      })




        res.redirect("/login");
      });
    }
  })
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////generic post routes /////////////////////////////////////////////////////////////////////////////

app.post("/:a",function(req,response){

 b=req.body.distance;
var z=req.params["a"];
if(z==="CarTravel"){                     //checking the route type to pass it to the API path
     a=req.body.cars;
carsDist=req.body.distance;
cfuel=req.body.fuel;
var type1="CarTravel";


}
else if(z=="CarTravel2"){
  b=req.body.distance2;
  a=req.body.cars2;
  carsDist=req.body.distance2;
  cfuel=req.body.fuel2;
  var type1="CarTravel";
  console.log(carsDist);
}
else if(z==="Flight"){
   a=req.body.vehical;
   flightDist=req.body.distance;
     var type1="Flight";
}
else if(z==="PublicTransit"){
  a=req.body.public;
  publicDist=req.body.distance;
    var type1="PublicTransit";
}
else{
   a=req.body.bike;
   motorDist=req.body.distance;
     var type1="MotorBike";
}


var type="";
if(z==="CarTravel" || z==="CarTravel2"){
  type="vehicle";
}                                              //setting type for url
else{
  type="type";
}
const options = {
	"method": "GET",
	"hostname": "carbonfootprint1.p.rapidapi.com",
	"port": null,
	"path": "/CarbonFootprintFrom"+type1+"?distance="+b+"&"+type+"="+a,
	"headers": {
		"x-rapidapi-host": "carbonfootprint1.p.rapidapi.com",
  "x-rapidapi-key": "d864295110msha8c3f53c363d757p1c9a69jsn9c2890110010",
		"useQueryString": true
	}
};
console.log(options.path);
const request = https.request(options, function (res) {
	const chunks = [];

	res.on("data", function (chunk) {
		chunks.push(chunk);
	});
                                                                                            //getting data through https(api)
	res.on("end", function () {
		const body = Buffer.concat(chunks);


  const y=["/",z];
  var x=y.join('');
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////flight /////////////////////////////////////////////////////////////////////////////
 if(z==="Flight"){
Data.findOne({_id:_id}, function (err, user) {
    if(user.entry==="entry1"){
carbonFootprint2=JSON.parse(body).carbonEquivalent;
// carbonFootprint2 = carbonFootprint2.toFixed(2);
if(req.body.a==="two"){
  carbonFootprint2=carbonFootprint2*2;

}
carbonFootprintResult+=carbonFootprint2;
const flight={
  flightType:a,
  distance:flightDist,
  footprint:carbonFootprint2

}

Data.findByIdAndUpdate(_id, { $set: {Flight: flight }}, options, function(err){
  if(err){
    console.log(err);
  }
})
}
else{
  carbonFootprint12=JSON.parse(body).carbonEquivalent;
  // carbonFootprint2 = carbonFootprint2.toFixed(2);
  if(req.body.a==="two"){
    carbonFootprint12=carbonFootprint12*2;

  }
  carbonFootprintResult1+=carbonFootprint12;
  const flight={
    flightType:a,
    distance:flightDist,
    footprint:carbonFootprint12

  }

  Data.findByIdAndUpdate(_id, { $set: {Flight1: flight }}, options, function(err){
    if(err){
      console.log(err);
    }
  })
}
})
 }
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////////car /////////////////////////////////////////////////////////////////////////////
else if(z==="CarTravel"){

    Data.findOne({_id:_id}, function (err, user) {
        var prev=JSON.parse(body).carbonEquivalent/100;
        prev.toFixed(2);
      carbonFootprint1+=JSON.parse(body).carbonEquivalent/100;
    carbonFootprint1.toFixed(2);
      // carbonFootprint1 = carbonFootprint1.toFixed(2);
      carbonFootprintResult+=prev;
      if(user.entry==="entry1"){





        const car={
          carType:a,
          distance:carsDist,
          fuel:cfuel,
          footprint:carbonFootprint1,
          carType2:user.Car.carType2,
          distance2:user.Car.distance2,
          fuel2:user.Car.fuel2,
          footprint1:prev,
          footprint2:user.Car.footprint2
        }

        Data.findByIdAndUpdate(_id, { $set: { Car: car }}, options, function(err){
          if(err){
            console.log(err);
          }
        })

      }
      else{
        var prev=JSON.parse(body).carbonEquivalent;
        carbonFootprint11+=JSON.parse(body).carbonEquivalent;

        carbonFootprintResult1+=prev;

        const car={
          carType:a,
          distance:carsDist,
          fuel:cfuel,
          footprint:carbonFootprint11,
          carType2:user.Car1.carType2,
          distance2:user.Car1.distance2,
          fuel2:user.Car1.fuel2,
          footprint1:prev,
          footprint2:user.Car1.footprint2

        }

        Data.findByIdAndUpdate(_id, { $set: { Car1: car }}, options, function(err){
          if(err){
            console.log(err);
          }
        })
      }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////CarTravel2 /////////////////////////////////////////////////////////////////////////////
else if(z==="CarTravel2"){

    Data.findOne({_id:_id}, function (err, user) {
        var prev=JSON.parse(body).carbonEquivalent;
      carbonFootprint1+=JSON.parse(body).carbonEquivalent;
      // carbonFootprint1 = carbonFootprint1.toFixed(2);
      carbonFootprintResult+=prev;
      if(user.entry==="entry1"){
        const car={
          carType:user.Car.carType,
          distance:user.Car.distance,
          fuel:user.Car.fuel,
          footprint:carbonFootprint1,
          carType2:a,
          distance2:carsDist,
          fuel2:cfuel,
          footprint2:prev,
          footprint1:user.Car.footprint1

        }

        Data.findByIdAndUpdate(_id, { $set: { Car: car }}, options, function(err){
          if(err){
            console.log(err);
          }
        })

      }
      else{
        var prev=JSON.parse(body).carbonEquivalent;
        carbonFootprint11+=JSON.parse(body).carbonEquivalent;

        carbonFootprintResult1+=prev;

        const car={
          carType:user.Car1.carType,
          distance:user.Car1.distance,
          fuel:user.Car1.fuel,
          footprint:carbonFootprint11,
          carType2:a,
          distance2:carsDist,
          fuel2:cfuel,
          footprint2:prev,
          footprint1:user.Car1.footprint1
        }

        Data.findByIdAndUpdate(_id, { $set: { Car1: car }}, options, function(err){
          if(err){
            console.log(err);
          }
        })
      }

    });
x="/CarTravel";
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////public /////////////////////////////////////////////////////////////////////////////
else if(z==="PublicTransit"){
  Data.findOne({_id:_id}, function (err, user) {
      if(user.entry==="entry1"){
    carbonFootprint4=JSON.parse(body).carbonEquivalent;
    // carbonFootprint4 = carbonFootprint4.toFixed(2);
    carbonFootprintResult+=carbonFootprint4;
    const public={
      vehicleType:a,
      distance:publicDist,
      footprint:carbonFootprint4
    }
    Data.findByIdAndUpdate(_id, { $set: { Public: public }}, options, function(err){
      if(err){
        console.log(err);
      }
    })
  }
  else{
    carbonFootprint14=JSON.parse(body).carbonEquivalent;
    // carbonFootprint4 = carbonFootprint4.toFixed(2);
    carbonFootprintResult1+=carbonFootprint14;
    const public={
      vehicleType:a,
      distance:publicDist,
      footprint:carbonFootprint14
    }
    Data.findByIdAndUpdate(_id, { $set: { Public1: public }}, options, function(err){
      if(err){
        console.log(err);
      }
    })
  }
})
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////motorbike /////////////////////////////////////////////////////////////////////////////
else{
  Data.findOne({_id:_id}, function (err, user) {
      if(user.entry==="entry1"){
  carbonFootprint3=JSON.parse(body).carbonEquivalent;
  // carbonFootprint3 = carbonFootprint3.toFixed(2);
  carbonFootprintResult+=carbonFootprint3;
  const motor={
    motorType:a,
    distance:motorDist,
    footprint:carbonFootprint3
  }
  Data.findByIdAndUpdate(_id, { $set: { Motor: motor }}, options, function(err){
    if(err){
      console.log(err);
    }
  })
}
else{
  carbonFootprint13=JSON.parse(body).carbonEquivalent;
  // carbonFootprint3 = carbonFootprint3.toFixed(2);
  carbonFootprintResult1+=carbonFootprint13;
  const motor={
    motorType:a,
    distance:motorDist,
    footprint:carbonFootprint13
  }
  Data.findByIdAndUpdate(_id, { $set: { Motor1: motor }}, options, function(err){
    if(err){
      console.log(err);
    }
  })
}
})

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////results /////////////////////////////////////////////////////////////////////////////

  Data.findOne({_id:_id}, function (err, user) {
    if(user.entry==="entry1"){
      const result={
      total:carbonFootprintResult
      }
      Data.findByIdAndUpdate(_id, { $set: { Result:result }}, options, function(err){
        if(err){
          console.log(err);
        }
      })

    }
else{
  const result1={
  total:carbonFootprintResult1
  }
  Data.findByIdAndUpdate(_id, { $set: { Result1:result1 }}, options, function(err){
    if(err){
      console.log(err);
    }
  })
}
});

  response.redirect(x);                                                     //redirectinig to corresponding routes
	});
});


request.end();

});

//
// var count=0;
// while(count!=1){
//   var SmallDieselCar=new MotorData({
//     name:"SmallDieselCar",
//     footprint:1.20
//   });
//   var MediumDieselCar=new MotorData({
//     name:"MediumDieselCar",
//     footprint:1.20
//   });
//   var LargeDieselCar=new MotorData({
//     name:"LargeDieselCar",
//     footprint:1.30
//
//   });
//   var MediumHybridCar=new MotorData({
//     name:"MediumHybridCar",
//     footprint:1.20
//   });
//   var LargeHybridCar=new MotorData({
//     name:"LargeHybridCar",
//     footprint:1.20
//   });
//   var MediumLPGCar=new MotorData({
//     name:"MediumLPGCar",
//     footprint:1.20
//   });
//   var LargeLPGCar=new MotorData({
//     name:"LargeLPGCar",
//     footprint:1.20
//   });
//   var SmallPetrolVan=new MotorData({
//     name:"SmallPetrolVan",
//     footprint:1.20
//   });
//   var MediumPetrolCar=new MotorData({
//     name:"MediumPetrolCar",
//     footprint:1.20
//   });
//   var LargePetrolCar=new MotorData({
//     name:"LargePetrolCar",
//     footprint:1.20
//   });
//   var MediumCNGCar=new MotorData({
//     name:"MediumCNGCar",
//     footprint:1.20
//   });
//   var LargeCNGCar=new MotorData({
//     name:"LargeCNGCar",
//     footprint:1.20
//   });
//
//
//
//   var DomesticFlight=new MotorData({
//     name:"DomesticFlight",
//     footprint:1.20
//   });
//   var ShortEconomyClassFlight=new MotorData({
//     name:"ShortEconomyClassFlight",
//     footprint:1.20
//   });
//   var ShortBusinessClassFlight=new MotorData({
//     name:"ShortBusinessClassFlight",
//     footprint:1.20
//   });
//   var LongEconomyClassFlight=new MotorData({
//     name:"LongEconomyClassFlight",
//     footprint:1.20
//   });
//   var LongPremiumClassFlight=new MotorData({
//     name:"LongPremiumClassFlight",
//     footprint:1.20
//   });
//   var LongBusinessClassFlight=new MotorData({
//     name:"LongBusinessClassFlight",
//     footprint:1.20
//   });
//   var LongFirstClassFlight=new MotorData({
//     name:"LongFirstClassFlight",
//     footprint:1.20
//   });
//
//
//
//
//   var Taxi=new MotorData({
//     name:"Taxi",
//     footprint:1.20
//   });
//   var ClassicBus=new MotorData({
//     name:"ClassicBus",
//     footprint:1.20
//   });
//   var Coach=new MotorData({
//     name:"Coach",
//     footprint:1.20
//   });
//   var NationalTrain=new MotorData({
//     name:"NationalTrain",
//     footprint:1.20
//   });
//   var LightRail=new MotorData({
//     name:"LightRail",
//     footprint:1.20
//   });
//   var EcoBus=new MotorData({
//     name:"EcoBus",
//     footprint:1.20
//   });
//   var FerryOnFoot=new MotorData({
//     name:"FerryOnFoot",
//     footprint:1.20
//   });
//
//
//
//
//
// var SmallMotorBike=new MotorData({
//   name:"SmallMotorBike",
//   footprint:1.20
// });
// var MediumMotorBike=new MotorData({
//   name:"MediumMotorBike",
//   footprint:2.20
// });
// var LargeMotorBike=new MotorData({
//   name:"LargeMotorBike",
//   footprint:3.20
// });
// // ,MediumDieselCar, LargeDieselCar, MediumHybridCar, LargeHybridCar, MediumLPGCar, LargeLPGCar, MediumCNGCar, LargeCNGCar, SmallPetrolVan, MediumPetrolCar, LargePetrolCar, DomesticFlight, ShortEconomyClassFlight, ShortBusinessClassFlight, LongEconomyClassFlight, LongPremiumClassFlight, LongBusinessClassFlight, LongFirstClassFlight,Taxi, ClassicBus, Coach, NationalTrain, LightRail,EcoBus, FerryOnFoot
// MotorData.insertMany([SmallMotorBike,MediumMotorBike,LargeMotorBike ,MediumDieselCar, LargeDieselCar, MediumHybridCar, LargeHybridCar, MediumLPGCar, LargeLPGCar, MediumCNGCar, LargeCNGCar, SmallPetrolVan, MediumPetrolCar, LargePetrolCar, DomesticFlight, ShortEconomyClassFlight, ShortBusinessClassFlight, LongEconomyClassFlight, LongPremiumClassFlight, LongBusinessClassFlight, LongFirstClassFlight,Taxi, ClassicBus, Coach, NationalTrain, LightRail,EcoBus, FerryOnFoot],function(err){
//   if(err){
//     console.log(err);
//   }
// });
// count++;
// }
//


app.listen("3000",function(){
  console.log("the server is up and running");
})
