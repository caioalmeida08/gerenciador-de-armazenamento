// Função utilizada para comunicar a criação de uma nova memória
$("#ae_criar_button").on("click", async (e) => {
  e.preventDefault();

  let form = {
    criar: $("input[name='ae_criar']").val(),
  };

  try {
    const response = await $.get("/alocacaoEncadeada", form);
    if (jQuery.isEmptyObject(response)) {
      throw "não foi possível criar a memória";
    }
    $("form").trigger("reset");
    console.log(response);
  } catch (error) {
    console.log("erro ", error);
  }
});
// Função utilizada para comunicar a criação de um novo arquivo
$("#ae_alocacaoEncadeada_button").on("click", async (e) => {
  e.preventDefault();

  let form = {
    alocacaoEncadeada: $("input[name='ae_alocacaoEncadeada']").val(),
  };

  try {
    // checa se o arquivo tem o tamanho mínimo
    if (form.alocacaoEncadeada < 1) {
      throw "tamanho de arquivo mínimo não atingido";
    }

    const response = await $.get("/alocacaoEncadeada", form);
    if (jQuery.isEmptyObject(response)) {
      throw "não foi possível criar este arquivo";
    }
    $("form").trigger("reset");
    console.log(response);
  } catch (error) {
    console.log("erro ", error);
  }
});
// Função utilizada para comunicar a deleção de um arquivo
$("#ae_deletarArquivo_button").on("click", async (e) => {
  e.preventDefault();

  let form = {
    deletarArquivo: $("input[name='ae_deletarArquivo']").val(),
  };

  try {
    const response = await $.get("/alocacaoEncadeada", form);
    if (jQuery.isEmptyObject(response)) {
      throw "não foi possível deletar este arquivo";
    }
    $("form").trigger("reset");
    console.log(response);
  } catch (error) {
    console.log("erro ", error);
  }
});
