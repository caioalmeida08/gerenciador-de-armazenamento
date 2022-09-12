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
  let possibilidades = "0123456789ABCDEF";
  let hexadecimal = new Array();
  let rgb = new Array();
  let escolha = Math.round(Math.random() * 1);
  // vermelho = Math.round(Math.random() * 256);
  // verde = Math.round(Math.random() * 256);
  // azul = Math.round(Math.random() * 256);
  let conta;




  let coresRGB = {
    vermelho: Math.round(Math.random() * 256),
    verde: Math.round(Math.random() * 256),
    azul: Math.round(Math.random() * 256)




  };
  console.log(coresRGB)


  if (coresRGB.vermelho < 230 && coresRGB.verde < 230 && coresRGB.azul < 230) {


    if (coresRGB.vermelho < 50 && coresRGB.verde < 50 || coresRGB.azul < 50) {

      rgbToHex(coresRGB.vermelho, coresRGB.verde, coresRGB.azul);
      console.log("caiu aqui")


    }

  } else {

    rgbToHex(coresRGB.vermelho, coresRGB.verde, coresRGB.azul);
    console.log("caiu no else")


  }


  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }



  return rgbToHex(coresRGB.vermelho, coresRGB.verde, coresRGB.azul);

};
