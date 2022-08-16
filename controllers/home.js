//' FUNÇÕES DO CONTROLLER

const home_get = async (req, res) => {
  res.render("index.html");
};

//' LIGAÇÃO COM ROUTER HOME
module.exports = {
  home_get,
};
