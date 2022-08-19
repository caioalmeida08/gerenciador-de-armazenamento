// Função utilizada para comunicar a criação de uma nove memória
$("#ai_criar_button").on("click", async (e) => {
  e.preventDefault();

  let form = {
    criar: $("input[name='ai_criar']").val(),
  };

  try {
    // checa se o arquivo tem o tamanho mínimo
    if (form.alocacaoEncadeada < 1) {
      throw "Tamanho de arquivo mínimo não atingido";
    }

    const response = await $.get("/alocacaoIndexada", form);
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
$("#ai_alocacaoIndexada_button").on("click", async (e) => {
  e.preventDefault();

  let form = {
    alocacaoIndexada: $("input[name='ai_alocacaoIndexada']").val(),
  };

  try {
    // checa se o arquivo tem o tamanho mínimo
    if (form.alocacaoIndexada < 1) {
      throw "tamanho de arquivo mínimo não atingido";
    }
    $("form").trigger("reset");

    const response = await $.get("/alocacaoIndexada", form);

    if (jQuery.isEmptyObject(response)) {
      throw response;
    }
    console.log(response);
  } catch (error) {
    console.log(error.responseText || error);
  }
});
// Função utilizada para comunicar a deleção de um arquivo
$("#ai_deletarArquivo_button").on("click", async (e) => {
  e.preventDefault();

  let form = {
    deletarArquivo: $("input[name='ai_deletarArquivo']").val(),
  };

  try {
    const response = await $.get("/alocacaoIndexada", form);
    $("form").trigger("reset");

    if (jQuery.isEmptyObject(response)) {
      throw response;
    }
    console.log(response);
  } catch (error) {
    console.log(error.responseText);
  }
});
