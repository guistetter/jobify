const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const path = require("path")
const sqlite = require("sqlite")
const dbConnection = sqlite.open(path.resolve(__dirname, "banco.sqlite"), { Promise })

const port = process.env.PORT || 3000

app.set("views", path.join(__dirname, "views"))

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname,"public")))
app.use(bodyParser.urlencoded({extended: true}))

const init = async() => {
  try{
      const db = await dbConnection
      
      //await db.run('CREATE TABLE IF NOT EXISTS categorias (id INTEGER PRIMARY KEY, categoria TEXT);')
      //  const categoria = "Ui Design Team"
      //  await db.run(`INSERT INTO categorias(categoria) VALUES('${categoria}');`)
      
      //await db.run('CREATE TABLE IF NOT EXISTS vagas (id INTEGER PRIMARY KEY, categoria INTEGER, titulo TEXT, descricao TEXT);')
        //  const vaga = "UI/UX Senior (REMOTE)"
        //  const descricao = "Vaga para UI Design com experiencia"
        //  await db.run(`INSERT INTO vagas(categoria, titulo, descricao) values(3,'${vaga}','${descricao}');`)
    }catch(err){
    err
  }
}
init();

app.get("/", async(req,res) => {

  const db = await dbConnection
  const categoriasDb = await db.all("SELECT * FROM categorias;")
  const vagas = await db.all("SELECT * FROM vagas;")
  
  const categorias = categoriasDb.map(cat => {
    return{
      ...cat,
      vagas: vagas.filter(vaga => vaga.categoria === cat.id) 
    }
  })
  console.log(categorias.vagas)

  res.render("home", {
    categorias
  })
});

app.get("/vaga/:id", async function(req, res){
  console.log(req.params)
  const db = await dbConnection
  const vaga = await db.get(`SELECT * FROM vagas where id =${req.params.id}`)
  res.render("vaga",{
    vaga
  })
})


app.get("/admin", (req, res) => {
  res.render("admin/home")
});

app.get("/admin/vagas", async(req, res) => {
  const db = await dbConnection
  const vagas = await db.all("SELECT * FROM vagas;")
  res.render("admin/vagas",{vagas})
})

app.get("/admin/vagas/delete/:id", async(req,res) => {
  try {
    const db = await dbConnection
    await db.run(`delete from vagas where id =${req.params.id}`)
    res.redirect("/admin/vagas");
  } catch (error) {
   console.log(error, "aqui") 
  }
})

app.get("/admin/vagas/nova", async(req,res) =>{
  const db = await dbConnection
  const categorias = await db.all("SELECT * FROM CATEGORIAS")
  res.render("admin/nova-vaga", {categorias})
})

app.post("/admin/vagas/nova", async(req, res) => {
  const db = await dbConnection
  //res.send(req.body)
  const {titulo, descricao, categoria} = req.body
  await db.run(`INSERT INTO vagas(categoria, titulo, descricao) values(${categoria},'${titulo}','${descricao}')`)
  res.redirect("/admin/vagas")
})

app.get("/admin/vagas/editar/:id", async(req,res) =>{
  const db = await dbConnection
  const categorias = await db.all("SELECT * FROM CATEGORIAS")
  const vaga = await db.get(`SELECT * FROM vagas where id =${req.params.id}`)
  res.render("admin/editar-vaga", {categorias, vaga})
})

app.post("/admin/vagas/editar/:id", async(req, res) => {
  const db = await dbConnection
  const {titulo, descricao, categoria} = req.body
  const {id} = req.params
  await db.run(`UPDATE vagas set categoria =${categoria}, titulo = '${titulo}', descricao = '${descricao}' WHERE id = ${id}`)
  res.redirect("/admin/vagas")
})
app.use(function (req,res,next){
  //res.redirect("/")
  res.render("error")
});

app.listen(port, (err) =>{
  if(err){
    console.log("algo deu errado")
  } else {
    console.log("servidor rodando")
  }
  
})
