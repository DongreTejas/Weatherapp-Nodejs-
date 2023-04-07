const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8");
const replaceval=(tempval,orgval)=>{
    let temperature = tempval.replace("{% tempval%}",orgval.main.temp);
    temperature = temperature.replace("{% tempvalmin%}",orgval.main.temp_min);
    temperature = temperature.replace("{% tempvalmax%}",orgval.main.temp_max);
    temperature = temperature.replace("{%location%}",orgval.name);
    temperature = temperature.replace("{%country%}",orgval.sys.country);
    temperature = temperature.replace("{% tempstatus%}",orgval.weather[0].main);
    return temperature
}
const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests(`https://api.openweathermap.org/data/2.5/weather?q=Nagpur&units=metric&appid=c15b42bb7ec33197e3216458ea2cec7f`)
.on('data', (chunk)=> {
    const objData = JSON.parse(chunk);
    const arraydata =[objData]
    const realTimeData = arraydata.map((val)=>replaceval(homeFile,val)).join("");
        res.write(realTimeData)
    })
.on('end',(err) =>{
  if (err) return console.log('connection closed due to errors', err);
    res.end();
});
    }
    else{
        res.end("File not found");
    }
});

server.listen(8000,"127.0.0.1");