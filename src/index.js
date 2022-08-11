// * Definição das flags de execução do sistema:

// Detecta o modo de execucao digitado no cmd
const modo = process.argv[2];

// * Armazena a estrutura da memoria física
class Memoria {
  constructor(quantidadeBloco, tamanhoBloco) {
    // quantidade total de blocos presentes na memoria
    this.quantidadeBloco = quantidadeBloco;
    // tamanho de cada bloco de memoria
    this.tamanhoBloco = tamanhoBloco;
  }
}

// * Funcao responsavel pela alocação contígua
function alocacaoContigua() {
  // instancia uma memoria local, disponivel apenas dentro da funcao alocacao contígua
  let memoria = new Memoria(256, 1);

  console.log("quantidadeBlocos ->", memoria.quantidadeBloco);
}

// * Chama a funcao apropriada de acordo com o modo de execucao
// Caso o modo selecionado seja alocacao contigua
if (modo == "alocacaoContigua") {
  alocacaoContigua();
}
