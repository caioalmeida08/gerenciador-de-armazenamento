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
    if (this.checarEspaco() < tamanhoArquivo + 1) {
      if (this.maiorEspacoDisponivel().tamanho < tamanhoArquivo) {
        throw "Não foi possível gravar o arquivo";
      }
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
      this.disco[blocoDeIndice[i]] = {
        conteudo: this.idArquivo,
        proximo: blocoDeIndice[i + 1] || undefined,
      };
    }

    // incrementa o id do arquivo
    this.idArquivo++;
  }

  // * Método responsável por deletar um arquivo da memoria
  deletarArquivo(idArquivo) {
    // itera por todos os blocos da memoria
    for (let i = 0; i < this.quantidadeBloco; i++) {
      // checa se o bloco está alocado pelo método contíguo ou se pelo metodo encadeado/indexado
      if (typeof this.disco[i] == "object") {
        // bloco de alocacaoIndexada ou AlocacaoIndexada
        // checa se o bloco está ocupado pelo arquivo desejado
        if (this.disco[i].conteudo == idArquivo) {
          // esvazia o bloco
          this.disco[i] = undefined;
          // remove o blocoDeIndice do arquivo
          if (typeof this.disco[i - 1] == "object") {
            this.disco[i - 1] = undefined;
          }
        }
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
      // cria uma nova memória
      memoria = new Memoria(req.query.criar);
    }

    // aloca um novo arquivo
    if (req.query.alocacaoIndexada) {
      memoria.alocacaoIndexada(req.query.alocacaoIndexada);
    }

    // deleta um arquivo
    if (req.query.deletarArquivo) {
      memoria.deletarArquivo(req.query.deletarArquivo);
    }

    res.json(memoria);
  } catch (err) {
    res.json({
      erro: err.message,
    });
  }
};

//' LIGAÇÃO COM ROUTER HOME
module.exports = {
  alocacaoIndexada_get,
};
