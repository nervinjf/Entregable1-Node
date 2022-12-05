const http = require('http');
const path = require('path');
const fs = require('fs/promises');


const PORT = 3001;
const app = http.createServer(async (req, res) => {

    const method = req.method;
    const url = req.url
    if (url === "/tasks") {
        const jsonpath = path.resolve("./data.json");
        const jsonfile = await fs.readFile(jsonpath, 'utf8')
        if (method === "GET") {
            res.setHeader('content-Type', 'application/json')
            res.write(jsonfile)
        }
        if (method === "POST") {
            req.body('data', (data) => {
                const newTask = JSON.parse(data);
                const arr = JSON.parse(jsonfile);
                arr.push(newTask)
                fs.writeFile(jsonpath, JSON.stringify(arr), (error) => {
                    if (error) {
                        console.log(error)
                    }
                })
            })
        }
        if (method === "DELETE") {
            const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
            const { id } = req.body;
            const tasks = taskArray.filter(task => task.id !== id);
            await fs.writeFile(jsonPath, JSON.stringify(tasks), (error) => {
                if (error) {
                    console.log(error)
                }
            });
            res.sendStatus(200);
        }
        if (method === "PUT") {
            const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
            const { id, status } = req.body;
            const taskIndex = taskArray.findIndex(task => task.id === id);
            taskArray[taskIndex].status = status;
            await fs.writeFile(jsonPath, JSON.stringify(taskArray), (error) => {
                if (error) {
                    console.log(error)
                }
            });
            res.sendStatus(200);
        };
    }
res.end();
})

app.listen(PORT);

console.log(`esta corriendo en el Servidor ${PORT}`)