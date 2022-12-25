const express = require('express');
const axios = require('axios');
const cors = require('cors');
const getOrSetCache = require('./get-set-cache');


const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get('/photos', async (req, res) => {
    try{
        const albumId = req.query.albumId;
        const photos = await getOrSetCache(`photos?albumId=${albumId}`, async () => {
            const {data} = await axios.get(
                "https://jsonplaceholder.ir/photos",
                {params: {albumId}}
            );
            return data;
        });
        res.json(photos);
    } catch(e){
        console.error(e);
    }
});

app.get('/photos/:id', async (req, res) => {
    const id = req.params.id;
    const photo = await getOrSetCache(`photos:${id}`, async () => {
        const {data} = await axios.get(
            `https://jsonplaceholder.ir/photos/${req.params.id}`
        );
        return data;
    })

    res.json(photo);
});

app.listen(port=3000, host="localhost", () => {
    console.log(`Example app listening on port http://${host}:${port}`);
});