// Função utilizada para comunicar a criação de uma nova memória
$("#ac_criar_button").on("click", async (e) => {
  e.preventDefault();

  let form = {
    criar: $("input[name='ac_criar']").val(),
  };

  try {
    $("form").trigger("reset");
    const response = await $.get("/alocacaoContigua", form);
    if (jQuery.isEmptyObject(response)) {
      throw response;
    }
    console.log(response);
  } catch (error) {
    console.log(error.responseText);
  }
});
// Função utilizada para comunicar a criação de um novo arquivo
$("#ac_alocacaoContigua_button").on("click", async (e) => {
  e.preventDefault();

  let form = {
    alocacaoContigua: $("input[name='ac_alocacaoContigua']").val(),
  };

  try {
    $("form").trigger("reset");

    // checa se o arquivo tem o tamanho mínimo
    if (form.alocacaoContigua < 1) {
      throw "Tamanho de arquivo mínimo não atingido";
    }

    const response = await $.get("/alocacaoContigua", form);
    if (jQuery.isEmptyObject(response)) {
      throw response;
    }
    console.log(response);
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
    $("form").trigger("reset");
    const response = await $.get("/alocacaoContigua", form);
    if (jQuery.isEmptyObject(response)) {
      throw response;
    }
    console.log(response);
  } catch (error) {
    console.log(error.responseText);
  }
});
