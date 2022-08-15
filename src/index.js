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

// * Armazena a estrutura de um bloco da memória física
// class Bloco {
//   constructor(idBloco, conteudoBloco) {
//     // identificador do bloco
//     this.idBloco = idBloco;
//     // conteudo do bloco
//     this.conteudoBloco = conteudoBloco;
//   }
// }

// * Armazena a estrutura da memória física
class Memoria {
  constructor(quantidadeBloco, tamanhoBloco) {
    // quantidade total de blocos presentes na memoria
    this.quantidadeBloco = quantidadeBloco;
    // tamanho de cada bloco de memoria
    this.tamanhoBloco = tamanhoBloco;
    // o disco inicialmente é criado vazio, sem nenhum bloco integrado, e posteriormente populado com a funcao popularBlocos()
    // disco físico da memória
    this.disco = new Array(quantidadeBloco);
  }

  // checa o espaco disponivel na memoria
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

  // checa o maior espaco ininterrupto na memoria
  maiorEspacoDisponivel() {
    // armazena os dados referentes aos espacos vazios da memoria
    let espacos = [];

    // armazena os dados de um unico espaco vazio da memoria
    let espaco = {
      inicio: 0,
      tamanho: 0,
    };

    // itera por todos os blocos da memoria
    for (let i = 0; i < this.quantidadeBloco; i++) {
      // representa um bloco da memoria
      let bloco = this.disco[i];

      // checa se o bloco está vazio e incrementa o contador
      if (bloco == undefined) {
        // armazena o indice do inicio do espaco
        if (espaco.inicio == 0) {
          espaco.inicio = i;
        }
        // conta quantos blocos estao disponiveis
        espaco.tamanho++;
      } else {
        // armazena o espaco vazio e seus dados
        espacos.push(espaco);
        // reseta a variavel
        espaco = {
          inicio: 0,
          tamanho: 0,
        };
      }
    }
    espacos.push(espaco);

    // filtra o array espacos com base no tamanho de cada espaco, resultado em ordem crescente
    espacos.sort(maiorTamanho);

    return espacos[0];
  }

  // adiciona um arquivo na memória
  adicionarArquivo() {
    //
  }

  // popula o disco com blocos
  // popularBlocos() {
  //   // armazena temporariamente o conteudo do disco
  //   let discoTemporario = new Array(this.quantidadeBloco);
  //   // popula o vetor temporario
  //   for (let i = 0; i < this.quantidadeBloco; i++) {
  //     discoTemporario.push(new Bloco(i, null));
  //   }
  //   // torna o disco temporario definitivo
  //   return discoTemporario;
  // }
}

// * Armazena a estrutura de um arquivo

// class Arquivo {
//   constructor(idArquivo, tamanhoArquivo) {
//     // identificador do arquivo
//     this.idArquivo = this.idArquivo;
//     // tamanho do aquivo
//     this.tamanhoArquivo = tamanhoArquivo;
//     // this
//   }
// }

// * Funcao responsavel pela alocação contígua
function alocacaoContigua() {
  // instancia uma memoria local, disponivel apenas dentro da funcao alocacao contígua
  let memoria = new Memoria(8, 1);

  memoria.disco[1] = "A";

  console.log(memoria.checarEspaco());
}

// * Chama a funcao apropriada de acordo com o modo de execucao
// Caso o modo selecionado seja alocacao contigua
if (modo == "alocacaoContigua") {
  alocacaoContigua();
}
