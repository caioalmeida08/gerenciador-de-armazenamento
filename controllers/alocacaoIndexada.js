// * Armazena a estrutura da memória física
class Memoria {
  constructor(quantidadeBloco) {
    // quantidade total de blocos presentes na memoria
    this.quantidadeBloco = quantidadeBloco;
    // o disco inicialmente é criado vazio, sem nenhum bloco integrado, e posteriormente populado com a funcao popularBlocos()
    // disco físico da memória
    this.disco = new Array();
    // armazena em memoria o nome (id) do ultimo arquivo gravado em disco
    this.idArquivo = 0;
    // armazena o tipo de alocação
    this.tipoAlocacao = "alocacaoIndexada";
  }

  // * Checa o espaco disponivel na memoria
  checarEspaco() {
    // conta quantos blocos vazios existem
    let contador = 0;
    // itera por todos os blocos da memoria
    for (let i = 0; i < this.quantidadeBloco; i++) {
      // checa se o bloco está vazio e incrementa o contador
      if (this.disco[i] == undefined) {
        contador++;
      }
    }
    return contador;
  }

  // * Método responsavel pela alocação encadeada
  alocacaoIndexada(tamanhoArquivo) {
    // checa se há espaço suficiente em disco
    if (this.checarEspaco() - 1 < tamanhoArquivo) {
      throw "Não foi possível gravar o arquivo";
    }

    // itera pela memoria e armazena os blocos em que serão gravados arquivos
    let blocoDeIndice = new Array();
    for (let i = 0; i < this.quantidadeBloco; i++) {
      // checa se já foram encontrados todos os blocos necessários e finaliza o loop
      if (blocoDeIndice.length - 1 == tamanhoArquivo) {
        break;
      }

      // checa se o bloco está vazio
      if (this.disco[i] == undefined) {
        // salva o índice do bloco vazio
        blocoDeIndice.push(i);
      }
    }

    // grava os arquivos em disco
    for (let i = 0; i < blocoDeIndice.length; i++) {
      // salva o bloco de índice na memória
      if (i == 0) {
        let temporario = [...blocoDeIndice];
        temporario.shift();
        this.disco[blocoDeIndice[i]] = temporario;
        continue;
      }
      // grava o arquivo em disco
      this.disco[blocoDeIndice[i]] = this.idArquivo;
    }

    // incrementa o id do arquivo
    this.idArquivo++;
  }

  // * Método responsável por deletar um arquivo da memoria
  deletarArquivo(idArquivo) {
    // checa se o arquivo existe na memoria
    let existe = false;
    for (let i = 0; i < this.quantidadeBloco; i++) {
      if (this.disco[i] == idArquivo) {
        existe = true;
        break;
      }
    }

    // emite erro caso o arquivo nao exista
    if (!existe) {
      throw "Esse arquivo não existe na memória";
    }
    // itera por todos os blocos da memoria
    for (let i = 0; i < this.quantidadeBloco; i++) {
      // checa se o bloco está alocado pelo método contíguo ou se pelo metodo encadeado/indexado
      if (
        typeof this.disco[i] == "object" &&
        this.disco[this.disco[i][0]] == idArquivo
      ) {
        this.disco[i] = undefined;
      }
      if (this.disco[i] == idArquivo) {
        this.disco[i] = undefined;
      }
    }
  }
}

//' INSTÂNCIA DA MEMORIA

let memoria;

//' FUNÇÕES DO CONTROLLER

const alocacaoIndexada_get = async (req, res) => {
  try {
    // checa se há um pedido de criação de nova memória
    if (req.query.criar) {
      // checa se a memória tem o espaço mínimo de 1
      if (req.query.criar < 1) {
        throw "Espaço mínimo da memória é de 1";
      }
      // checa se a memória tem o espaço máximo de 256
      if (req.query.criar > 256) {
        throw "Espaço máximo da memória é de 256";
      }
      // cria uma nova memória
      memoria = new Memoria(req.query.criar);
    }

    // checa se a memória já foi criada
    if (memoria == undefined) {
      throw "Memória de alocação indexada não inicializada";
    }

    // checa se é um pedido de atualização da tabela (get)
    if (req.query.getMemoria) {
      res.json(memoria);
      return;
    }

    // aloca um novo arquivo
    if (req.query.tamanhoArquivo) {
      memoria.alocacaoIndexada(req.query.tamanhoArquivo);
    }

    // deleta um arquivo
    if (req.query.deletarArquivo) {
      memoria.deletarArquivo(req.query.deletarArquivo);
    }

    res.json(memoria);
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

//' LIGAÇÃO COM ROUTER HOME
module.exports = {
  alocacaoIndexada_get,
};
