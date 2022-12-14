//' API
// * Funções utilitarias
// filtro da funcao .sort() que ordena um array de objetos com base na propriedade tamanho
function maiorTamanho(a, b) {
  if (a.tamanho > b.tamanho) {
    return -1;
  }
  if (a.tamanho < b.tamanho) {
    return 1;
  }
  return 0;
}

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
    this.tipoAlocacao = "alocacaoContigua";
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

  // * Checa o primeiro espaco ininterrupto na memoria e retorna o maior deles
  primeiroEspacoDisponivel(tamanhoArquivo) {
    // armazena os dados referentes aos espacos vazios da memoria
    let espacos = [];

    // armazena os dados de um unico espaco vazio da memoria
    let espaco = {
      inicio: undefined,
      tamanho: 0,
    };

    // itera por todos os blocos da memoria
    for (let i = 0; i < this.quantidadeBloco; i++) {
      // checa se o espaço já é suficiente
      if (espaco.tamanho == tamanhoArquivo) {
        break;
      }
      if (this.disco[i] == undefined) {
        // armazena o indice do inicio do espaco
        if (espaco.inicio == undefined) {
          espaco.inicio = i;
        }
        // conta quantos blocos estao disponiveis
        espaco.tamanho++;
      } else {
        // armazena o espaco vazio e seus dados
        espacos.push(espaco);
        // reseta a variavel
        espaco = {
          inicio: undefined,
          tamanho: 0,
        };
      }
    }
    espacos.push(espaco);

    // filtra o array espacos com base no tamanho de cada espaco, resultado em ordem decrescente
    espacos.sort(maiorTamanho);

    return espacos[0];
  }

  // * Método responsavel pela alocação contígua
  alocacaoContigua(tamanhoArquivo) {
    // checa se o arquivo tem o tamanho mínimo necessário
    if (tamanhoArquivo <= 0) {
      throw "O arquivo precisa ter no mínimo 1 bloco de tamanho";
    }
    // checa se a memória é capaz de receber o arquivo
    if (
      this.primeiroEspacoDisponivel(tamanhoArquivo).tamanho < tamanhoArquivo
    ) {
      throw "Não é possível gravar o arquivo, espaço insuficiente";
    }

    // busca onde gravar o arquivo
    let espaco = this.primeiroEspacoDisponivel(tamanhoArquivo);

    // grava o arquivo no disco
    for (let i = 0; i < tamanhoArquivo; i++) {
      // grava o bloco
      this.disco[espaco.inicio] = this.idArquivo;

      // itera para o proximo bloco da memoria
      espaco.inicio++;
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
      // bloco de alocacaoContigua
      // checa se o bloco está ocupado pelo arquivo desejado
      if (this.disco[i] == idArquivo) {
        // esvazia o bloco
        this.disco[i] = undefined;
      }
    }
  }
}

//' INSTÂNCIA DA MEMORIA

let memoria;

//' FUNÇÕES DO CONTROLLER

const alocacaoContigua_get = async (req, res) => {
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
      throw "Memória de alocação contígua não inicializada";
    }

    // checa se é um pedido de atualização da tabela (get)
    if (req.query.getMemoria) {
      res.json(memoria);
      return;
    }

    // aloca um novo arquivo
    if (req.query.tamanhoArquivo) {
      memoria.alocacaoContigua(req.query.tamanhoArquivo);
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
  alocacaoContigua_get,
};
