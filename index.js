const express = require("express")
const app = express();

app.set("view engine", "ejs")

app.get("/", function(req, res){
  res.send("<h1>hello wolrd</h1>")
});

app.get("/admin", function(req, res){
  res.send("<p>hello wolrd admin</p>")
});

app.use(function (req,res,next){
  res.redirect("/")
});

app.listen(3000, (err) =>{
  if(err){
    console.log("algo deu errado")
  } else {
    console.log("servidor rodando")
  }
  
})
