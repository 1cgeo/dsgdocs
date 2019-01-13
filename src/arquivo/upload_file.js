const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/armazenamento_arquivos/");
  },
  filename: (req, file, cb) => {
    let nome = file.originalname.split(".");
    const extensao = nome.pop();
    nome = nome.join(".");
    nome = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    nome = nome.replace(/[^a-zA-Z0-9]/g, "_").replace(/_{2,}/g, "_");
    const uuid = Date.now();
    const nomeCorrigido = nome + "_" + uuid + "." + extensao;
    cb(null, nomeCorrigido);
  }
});

const upload = multer({ storage: storage }).single("workspace");

module.exports = upload;
