const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

// Установите папку загрузок для изображений
const uploadPath = path.join(__dirname, '../uploads/advertisements');

exports.uploadAdsImage = async (req, res) => {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: "Файл не загружен",
        });
      } else {
        let image = req.files.image;
        let number = req.body.number

        // Загрузка файла в Cloudinary
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          folder: "ads",
          public_id: `${number}`,
          format: 'png'
         });
  
        res.send({
          status: true,
          message: "Файл загружен",
          data: {
            mimetype: image.mimetype,
            size: image.size,
          },
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  };

exports.getAdsImage = (req, res) => {
    const { number } = req.params;
    fs.readdir(uploadPath, (err, files) => {
        if (err) {
            return res.status(500).send('Ошибка при чтении файлов.');
        }
        const fileUrls = files.map(file => `/uploads/advertisements/${file}`);
         if (fileUrls[number]){
            const imagePath = (path.join(__dirname, "../", fileUrls[number]));
            res.sendFile(imagePath);
         }
        //res.json(fileUrls);
    });
};