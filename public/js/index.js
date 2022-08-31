$(() => {
  // Função utilizada para comunicar a criação de uma nova memória
  $("#criar_memoria").on("click", async (e) => {
    // coleta os dados do input
    let form = {
      criar: $("input[name='tamanho_memoria']").val(),
    };

    try {
      // envia os dados ao back-end e aguarda resposta
      let response = await enviar(form);
      // tenta renderizar a resposta
      renderizar(response);
    } catch (error) {
      mostrarErro(error);
    }
  });
  // Função utilizada para comunicar a criação de um novo arquivo
  $("#criar_arquivo").on("click", async (e) => {
    // coleta os dados do input
    let form = {
      tamanhoArquivo: $("input[name='tamanho_arquivo']").val(),
    };

    try {
      // envia os dados ao back-end e aguarda resposta
      let response = await enviar(form);
      // tenta renderizar a resposta
      renderizar(response);
    } catch (error) {
      mostrarErro(error);
    }
  });
});

let deletar = async (idArquivo) => {
  // Função utilizada para comunicar a deleção de um arquivo
  let form = {
    deletarArquivo: idArquivo,
  };

  try {
    // envia os dados ao back-end e aguarda resposta
    let response = await enviar(form);
    // tenta renderizar a resposta
    renderizar(response);
  } catch (error) {
    mostrarErro(error);
  }
};

// tenta enviar os dados ao back-end
let enviar = async (form) => {
  let tipoAlocacao = $("#tipo_alocacao").val();
  const response = await $.get(tipoAlocacao, form);
  if (jQuery.isEmptyObject(response) || response.error != undefined) {
    throw response;
  }
  return response;
};

// renderiza a tabela
let cores = new Array();
let renderizar = (response) => {
  try {
    cores.push(corAleatoria());
    // deleta o conteudo da ta bela
    let tbody = document.getElementById("ac-tbody");
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

      if (typeof response.disco[i] == "object" && response.disco[i] != null) {
        conteudoLinha.innerHTML = "<i><small>Vazio</small></i>";
        if (typeof response.disco[i] != undefined) {
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
        }
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
    console.log(error);
  }
};

// mostra erros que ocorreram
let mostrarErro = (erro) => {
  $("#caixaDeErro").show();
  let caixaDeErro = document.getElementById("caixaDeErro");
  caixaDeErro.innerHTML = erro.error || erro.responseText || "";
};

let corAleatoria = () => {
  let possibilidades = "123456789ABCDEF";
  let hexadecimal = new Array();

  for (let i = 0; i < 6; i++) {
    hexadecimal.push(possibilidades[Math.round(Math.random() * 14)]);
  }

  hexadecimal.unshift("#");
  return hexadecimal.join("");
};
