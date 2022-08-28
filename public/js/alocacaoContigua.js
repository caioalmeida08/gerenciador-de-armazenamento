$(() => {
  // Função utilizada para comunicar a criação de uma nova memória
  $("#ac_criar_button").on("click", async (e) => {
    // previne o formulario de recarregar a pagina
    e.preventDefault();

    // coleta os dados do input
    let form = {
      criar: $("input[name='ac_criar']").val(),
    };

    try {
      // envia os dados ao back-end e aguarda resposta
      let response = await enviar(form);
      // tenta renderizar a resposta
      renderizar(response);
    } catch (error) {
      console.log(error.responseText || error);
    }
  });
  // Função utilizada para comunicar a criação de um novo arquivo
  $("#ac_alocacaoContigua_button").on("click", async (e) => {
    e.preventDefault();

    let form = {
      alocacaoContigua: $("input[name='ac_alocacaoContigua']").val(),
    };

    try {
      // envia os dados ao back-end e aguarda resposta
      let response = await enviar(form);
      // tenta renderizar a resposta
      renderizar(response);
    } catch (error) {
      console.log(error.responseText || error);
    }
  });
  // Função utilizada para comunicar a deleção de um arquivo
  $("#ac_deletarArquivo_button").on("click", async (e) => {
    e.preventDefault();

    let form = {
      deletarArquivo: $("input[name='ac_deletarArquivo']").val(),
    };

    try {
      // envia os dados ao back-end e aguarda resposta
      let response = await enviar(form);
      // tenta renderizar a resposta
      renderizar(response);
    } catch (error) {
      console.log(error.responseText || error);
    }
  });
});

// tenta enviar os dados ao back-end
let enviar = async (form) => {
  const response = await $.get("/alocacaoContigua", form);
  if (jQuery.isEmptyObject(response)) {
    throw response;
  }
  return response;
};

// renderiza a tabela
let renderizar = (response) => {
  // deleta o conteudo da ta bela
  let tbody = document.getElementById("ac-tbody");
  tbody.innerHTML = "";
  // percorre todo o disco
  for (let i = 0; i < response.quantidadeBloco; i++) {
    // popula cada linha da tabela
    let numeroLinha = document.createElement("th");
    numeroLinha.scope = "row";
    numeroLinha.innerHTML = i + 1;
    let conteudoLinha = document.createElement("td");
    conteudoLinha.innerHTML =
      response.disco[i] == undefined
        ? "<i><small>Vazio</small></i>"
        : response.disco[i];
    let linha = document.createElement("tr");
    linha.appendChild(numeroLinha);
    linha.appendChild(conteudoLinha);
    tbody.appendChild(linha);
  }
};
