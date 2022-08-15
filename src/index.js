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

// * Definição das flags de execução do sistema:

// Detecta o modo de execucao digitado no cmd
const modo = process.argv[2];

// * Armazena a estrutura da memória física
class Memoria {
  constructor(quantidadeBloco) {
    // quantidade total de blocos presentes na memoria
    this.quantidadeBloco = quantidadeBloco;
    // o disco inicialmente é criado vazio, sem nenhum bloco integrado, e posteriormente populado com a funcao popularBlocos()
    // disco físico da memória
    this.disco = new Array(quantidadeBloco);

    // armazena em memoria o nome (id) do ultimo arquivo gravado em disco
    this.idArquivo = 0;
  }

  // * Checa o espaco disponivel na memoria
  checarEspaco() {
    // conta quantos blocos vazios existem
    let contador = 0;
    // itera por todos os blocos da memoria
    for (let i = 0; i < this.quantidadeBloco; i++) {
      // representa um bloco da memoria
      let bloco = this.disco[i];
      // checa se o bloco está vazio e incrementa o contador
      if (bloco == undefined) {
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
      // representa um bloco da memoria
      let bloco = this.disco[i];
      // checa se o bloco está vazio e incrementa o contador
      if (bloco == undefined) {
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
    // checa se a memória é capaz de receber o arquivo
    if (this.maiorEspacoDisponivel().tamanho < tamanhoArquivo) {
      console.log(
        "Não há espaço suficiente em disco para alocar o arquivo: ",
        this.idArquivo,
        "(",
        tamanhoArquivo,
        "blocos)"
      );
      return;
    }

    // busca onde gravar o arquivo
    let espaco = this.maiorEspacoDisponivel();

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

  // * Alocação encadeada
  alocacaoEncadeada(tamanhoArquivo) {
    // checa se há espaço suficiente em disco
    if (this.checarEspaco() < tamanhoArquivo + 1) {
      console.log(
        "Não há espaço suficiente em disco para alocar o arquivo: ",
        this.idArquivo,
        "(",
        tamanhoArquivo,
        "blocos)"
      );
      return;
    }

    // itera pela memoria e armazena os blocos em que serão gravados arquivos
    let blocoDeIndice = new Array();
    for (let i = 0; i < this.quantidadeBloco; i++) {
      // checa se já foram encontrados todos os blocos necessários e finaliza o loop
      if (blocoDeIndice.length == tamanhoArquivo + 1) {
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
      // checa se o bloco está ocupado pelo arquivo desejado
      if (this.disco[i] == idArquivo) {
        // esvazia o bloco
        this.disco[i] = undefined;
      }
    }
  }
}

// * Chama a funcao apropriada de acordo com o modo de execucao
// Caso o modo selecionado seja alocacao contigua
if (modo == "alocacaoContigua") {
  // instancia uma memoria local, disponivel apenas dentro da funcao alocacao contígua
  let memoria = new Memoria(8);

  memoria.alocacaoEncadeada(2);
  memoria.alocacaoEncadeada(3);
  memoria.alocacaoEncadeada(3);
  console.log(memoria.disco);
}
