// Função utilizada para comunicar a criação de uma nova memória
$("#ae_criar_button").on("click", async (e) => {
  e.preventDefault();

  let form = {
    criar: $("input[name='ae_criar']").val(),
  };

  try {
    const response = await $.get("/alocacaoEncadeada", form);
    $("form").trigger("reset");
    if (jQuery.isEmptyObject(response)) {
      throw response;
    }
    console.log(response);
  } catch (error) {
    console.log(error.responseText);
  }
});
// Função utilizada para comunicar a criação de um novo arquivo
$("#ae_alocacaoEncadeada_button").on("click", async (e) => {
  e.preventDefault();

  let form = {
    alocacaoEncadeada: $("input[name='ae_alocacaoEncadeada']").val(),
  };

  try {
    $("form").trigger("reset");
    // checa se o arquivo tem o tamanho mínimo
    if (form.alocacaoEncadeada < 1) {
      throw "Tamanho de arquivo mínimo não atingido";
    }

    const response = await $.get("/alocacaoEncadeada", form);
    if (jQuery.isEmptyObject(response)) {
      throw response;
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  }
});
// Função utilizada para comunicar a deleção de um arquivo
$("#ae_deletarArquivo_button").on("click", async (e) => {
  e.preventDefault();

  let form = {
    deletarArquivo: $("input[name='ae_deletarArquivo']").val(),
  };

  try {
    $("form").trigger("reset");
    const response = await $.get("/alocacaoEncadeada", form);
    if (jQuery.isEmptyObject(response)) {
      throw response;
    }
    console.log(response);
  } catch (error) {
    console.log(error.responseText);
  }
});
