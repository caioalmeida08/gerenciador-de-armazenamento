$(() => {
  var memoria = memoriaContigua;
  // ações a tomar quando um botão de 'simulador', das seções 'sobre', for clicado
  $("#sobre_contigua").on("click", () => {
    $("#tipo_alocacao").val("/alocacaoContigua");
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $("#tipo_alocacao").offset().top - 100,
      },
      1000
    );
  });
  $("#sobre_encadeada").on("click", () => {
    $("#tipo_alocacao").val("/alocacaoEncadeada");
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $("#tipo_alocacao").offset().top - 100,
      },
      1000
    );
  });
  $("#sobre_indexada").on("click", () => {
    $("#tipo_alocacao").val("/alocacaoIndexada");
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $("#tipo_alocacao").offset().top - 100,
      },
      1000
    );
  });

  $("#tipo_alocacao").on("change", () => {
    try {
      // busca a memoria desejada
      memoria = mudarMemoria($("#tipo_alocacao").val());

      // tenta renderizar a resposta
      renderizar(memoria);
    } catch (error) {
      // checa se é um pedido de get com memória não iniciada
      if (error.error.includes("inicializada")) {
        // deleta o conteudo da ta bela
        let tbody = document.getElementById("tabela-body");
        tbody.innerHTML = "";

        // popula cada linha da tabela
        let linha = document.createElement("tr");
        let numeroLinha = document.createElement("th");
        numeroLinha.scope = "row";
        numeroLinha.innerHTML = "Vazio";
        let conteudoLinha = document.createElement("td");
        conteudoLinha.innerHTML = "Crie uma memória";
        let deletarLinha = document.createElement("td");

        linha.appendChild(numeroLinha);
        linha.appendChild(conteudoLinha);
        linha.appendChild(deletarLinha);
        tbody.appendChild(linha);
      }
      mostrarErro(error);
    }
  });
  // Função utilizada para comunicar a criação de uma nova memória
  $("#criar_memoria").on("click", () => {
    // coleta os dados do input
    let tamanhoMemoria = $("input[name='tamanho_memoria']").val();

    try {
      memoria = novaMemoria($("#tipo_alocacao").val(), tamanhoMemoria);
      // tenta renderizar a resposta
      renderizar(memoria);
    } catch (error) {
      mostrarErro(error);
    }
  });
  // Função utilizada para comunicar a criação de um novo arquivo
  $("#criar_arquivo").on("click", () => {
    // coleta os dados do input
    let tamanhoArquivo = $("input[name='tamanho_arquivo']").val();

    try {
      // envia os dados ao back-end e aguarda resposta
      memoria = mudarMemoria($("#tipo_alocacao").val());
      memoria.criarArquivo(tamanhoArquivo);
      // tenta renderizar a resposta
      renderizar(memoria);
    } catch (error) {
      mostrarErro(error);
    }
  });
});

// Função utilizada para comunicar a deleção de um arquivo
let deletar = (idArquivo) => {
  try {
    memoria = mudarMemoria($("#tipo_alocacao").val());
    memoria.deletarArquivo(idArquivo);
    // tenta renderizar a resposta
    renderizar(memoria);
  } catch (error) {
    mostrarErro(error);
  }
};

// tenta mudarMemoria os dados ao back-end
let mudarMemoria = (tipoMemoria) => {
  var response;
  switch (tipoMemoria) {
    case "memoriaContigua":
      response = memoriaContigua;
      break;

    case "memoriaEncadeada":
      response = memoriaEncadeada;
      break;

    case "memoriaIndexada":
      response = memoriaIndexada;
      break;
  }
  return response;
};

let novaMemoria = (tipoMemoria, tamanhoMemoria) => {
  switch (tipoMemoria) {
    case "memoriaContigua":
      memoriaContigua = new MemoriaContigua(tamanhoMemoria);
      response = memoriaContigua;
      break;

    case "memoriaEncadeada":
      memoriaEncadeada = new MemoriaEncadeada(tamanhoMemoria);
      response = memoriaEncadeada;
      break;

    case "memoriaIndexada":
      memoriaIndexada = new MemoriaIndexada(tamanhoMemoria);
      response = memoriaIndexada;
      break;
  }
  return response;
};

// renderiza a tabela
let cores = new Array();
let renderizar = (response) => {
  try {
    cores.push(corAleatoria());
    // deleta o conteudo da ta bela
    let tbody = document.getElementById("tabela-body");
    tbody.innerHTML = "";
    // percorre todo o disco
    for (let i = 0; i < response.quantidadeBloco; i++) {
      // popula cada linha da tabela
      let numeroLinha = document.createElement("th");
      numeroLinha.scope = "row";
      numeroLinha.innerHTML = i;
      let conteudoLinha = document.createElement("td");
      let deletarLinha = document.createElement("td");

      deletarLinha.innerHTML = "deletar";
      deletarLinha.classList = "deletar-button";

      switch (response.tipoAlocacao) {
        case "alocacaoContigua":
          conteudoLinha.innerHTML =
            response.disco[i] == undefined
              ? "<i><small>Vazio</small></i>"
              : response.disco[i];
          conteudoLinha.idArquivo = response.disco[i];
          conteudoLinha.style.borderRight =
            cores[response.disco[i]] + " 10px solid";
          deletarLinha.dataset.idArquivo = response.disco[i];
          break;

        case "alocacaoEncadeada":
          if (typeof response.disco[i] == "object") {
            if (response.disco[i].conteudo != undefined) {
              conteudoLinha.innerHTML =
                response.disco[i].conteudo +
                " | " +
                (response.disco[i].proximo || "null");
            } else {
              conteudoLinha.innerHTML = "<i><small>Vazio</small></i>";
            }
            conteudoLinha.idArquivo = response.disco[i].conteudo;
            conteudoLinha.style.borderRight =
              cores[response.disco[i].conteudo] + " 10px solid";
            deletarLinha.dataset.idArquivo = response.disco[i].conteudo;
          } else {
            conteudoLinha.innerHTML = "<i><small>Vazio</small></i>";
          }
          break;

        case "alocacaoIndexada":
          if (response.disco[i] != undefined) {
            if (typeof response.disco[i] == "object") {
              conteudoLinha.innerHTML = response.disco[i].join();
              let proximo;
              for (let j = 0; j < response.quantidadeBloco; j++) {
                if (response.disco[j] == response.disco[response.disco[i][0]]) {
                  proximo = j;
                }
              }
              conteudoLinha.idArquivo = response.disco[proximo];
              conteudoLinha.style.borderRight =
                cores[response.disco[proximo]] + " 10px solid";
              deletarLinha.dataset.idArquivo = response.disco[proximo];
            } else {
              conteudoLinha.innerHTML =
                response.disco[i] == undefined
                  ? "<i><small>Vazio</small></i>"
                  : response.disco[i];
              conteudoLinha.idArquivo = response.disco[i];
              conteudoLinha.style.borderRight =
                cores[response.disco[i]] + " 10px solid";
              deletarLinha.dataset.idArquivo = response.disco[i];
            }
            break;
          } else {
            conteudoLinha.innerHTML = "<i><small>Vazio</small></i>";
          }
      }

      let linha = document.createElement("tr");
      linha.appendChild(numeroLinha);
      linha.appendChild(conteudoLinha);
      linha.appendChild(deletarLinha);
      tbody.appendChild(linha);
    }
    // adiciona a funcionalidade do botao deletar
    $(".deletar-button").on("click", (e) => {
      deletar(e.currentTarget.dataset.idArquivo);
    });
    // apaga mensagens de erro antigas
    $("#caixaDeErro").hide();
  } catch (error) {
    mostrarErro(error);
  }
};

// mostra erros que ocorreram
let mostrarErro = (erro) => {
  $("#caixaDeErro").show();
  let caixaDeErro = document.getElementById("caixaDeErro");
  caixaDeErro.innerHTML = erro.error || erro.responseText || erro;
  console.log(erro);
};

let corAleatoria = () => {
  let possibilidades = "0123456789ABCDEF";
  let hexadecimal = new Array();

  for (let i = 0; i < 6; i++) {
    hexadecimal.push(possibilidades[Math.round(Math.random() * 15)]);
  }

  return rgbToHex(coresRGB.vermelho, coresRGB.verde, coresRGB.azul);
};
