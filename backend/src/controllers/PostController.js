const Post = require('../models/Post');
const jimp = require('jimp');
const path = require('path');
const fs = require('fs');

module.exports = {
    async index(req, res) {
        const posts = await Post.find().sort('-createdAt');

        return res.json(posts);
    },

    async store(req, res) {
        const { author, place, description, hashtags } = req.body;
        const { filename: image } = req.file;

        const [name] = image.split('.');
        const fileName = `${name}.jpg`;

        let jimpImg = await jimp.read(req.file.path);

        jimpImg.resize(500, jimp.AUTO).quality(70)
        .write(path.resolve(req.file.destination, 'resized', fileName));

        fs.unlinkSync(req.file.path);

        const post = await Post.create({
            author,
            place,
            description,
            hashtags,
            image: fileName,
        });

        req.io.emit('post', post);

        return res.json(post);
    }
};