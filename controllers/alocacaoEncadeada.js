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

  // * Checa o maior espaco ininterrupto na memoria e retorna o maior deles
  maiorEspacoDisponivel() {
    // armazena os dados referentes aos espacos vazios da memoria
    let espacos = [];

    // armazena os dados de um unico espaco vazio da memoria
    let espaco = {
      inicio: undefined,
      tamanho: 0,
    };

    // itera por todos os blocos da memoria
    for (let i = 0; i < this.quantidadeBloco; i++) {
      // checa se o bloco está vazio e incrementa o contador
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

  // * Método responsavel pela alocação encadeada
  alocacaoEncadeada(tamanhoArquivo) {
    // checa se há espaço suficiente em disco
    if (this.checarEspaco() < tamanhoArquivo) {
      console.log(
        "Não há espaço suficiente em disco para alocar o arquivo: ",
        this.idArquivo,
        "(",
        tamanhoArquivo,
        "blocos)"
      );
      return;
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
        continue;
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
    // itera por todos os blocos da memoria
    for (let i = 0; i < this.quantidadeBloco; i++) {
      // checa se o bloco está alocado pelo método contíguo ou se pelo metodo encadeado/indexado
      if (typeof this.disco[i] == "object") {
        // bloco de alocacaoEncadeada ou AlocacaoIndexada
        // checa se o bloco está ocupado pelo arquivo desejado
        if (this.disco[i].conteudo == idArquivo) {
          // esvazia o bloco
          this.disco[i] = undefined;
        }
      }
    }
  }
}

//' INSTÂNCIA DA MEMORIA

let memoria;

//' FUNÇÕES DO CONTROLLER

const alocacaoEncadeada_get = async (req, res) => {
  try {
    // checa se há um pedido de criação de nova memória
    if (req.query.criar) {
      // cria uma nova memória
      memoria = new Memoria(req.query.criar);
    }

    // aloca um novo arquivo
    if (req.query.alocacaoEncadeada) {
      memoria.alocacaoEncadeada(req.query.alocacaoEncadeada);
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
  alocacaoEncadeada_get,
};
