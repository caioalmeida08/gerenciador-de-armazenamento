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
    this.tipoAlocacao = "alocacaoEncadeada";
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
  alocacaoEncadeada(tamanhoArquivo) {
    // checa se há espaço suficiente em disco
    if (this.checarEspaco() < tamanhoArquivo) {
      throw "Não foi possível gravar o arquivo";
    }

    let contadorBlocosGravados = 0;

    // grava o arquivo no disco
    for (let i = 0; i < this.quantidadeBloco; i++) {
      // checa se o arquivo ja foi totalmente gravado
      if (contadorBlocosGravados == tamanhoArquivo) {
        break;
      }

      // checa se o bloco está vazio
      if (this.disco[i] != undefined) {
        if (this.disco[i].conteudo != undefined) {
          continue;
        }
      }

      // grava o arquivo
      this.disco[i] = {
        conteudo: this.idArquivo,
      };

      // armazena o endereço do proximo bloco
      let proximoBloco = 1;

      for (let j = 0; j < this.quantidadeBloco; j++) {
        if (this.disco[j] == undefined) {
          proximoBloco = j;
          break;
        } else if (this.disco[j].conteudo == undefined) {
          proximoBloco = j;
          break;
        }
      }

      // grava endereço do próximo bloco no bloco atual
      this.disco[i].proximo = proximoBloco;

      // incrementa o contador de blocos gravados
      contadorBlocosGravados++;

      // caso seja o ultimo bloco do arquivo, remove o ponteio de proximo
      if (contadorBlocosGravados == tamanhoArquivo) {
        this.disco[i].proximo = undefined;
      }
    }

    // incrementa o id do arquivo
    this.idArquivo++;
  }

  // * Método responsável por deletar um arquivo da memoria
  deletarArquivo(idArquivo) {
    // checa se o arquivo existe na memoria
    let existe = false;
    for (let i = 0; i < this.quantidadeBloco; i++) {
      if (typeof this.disco[i] != "object") {
        continue;
      }

      if (this.disco[i].conteudo == idArquivo) {
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
      if (typeof this.disco[i] == "object") {
        // bloco de alocacaoEncadeada ou AlocacaoIndexada
        // checa se o bloco está ocupado pelo arquivo desejado
        if (this.disco[i].conteudo == idArquivo) {
          // esvazia o bloco
          this.disco[i].conteudo = undefined;
          this.disco[i].proximo = undefined;
        }
      }
    }
  }
}

//' INSTÂNCIA DA MEMORIA

let memoria;

//' FUNÇÕES DO CONTROLLER

const alocacaoEncadeada_get = (req, res) => {
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
      throw "Memória de alocação encadeada não inicializada";
    }

    // checa se é um pedido de atualização da tabela (get)
    if (req.query.getMemoria) {
      res.json(memoria);
      return;
    }

    // aloca um novo arquivo
    if (req.query.tamanhoArquivo) {
      memoria.alocacaoEncadeada(req.query.tamanhoArquivo);
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
  alocacaoEncadeada_get,
};
