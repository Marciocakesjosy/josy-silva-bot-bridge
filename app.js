const money = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

const STORAGE_KEYS = {
  draft: "cakes-josy-silva-draft-v3",
  history: "cakes-josy-silva-history-v2",
  sequence: "cakes-josy-silva-order-sequence-v1",
  launchReset: "cakes-josy-silva-launch-reset-v1",
};

const LAUNCH_RESET_VERSION = "2026-04-18-start-orders";

function resetStoredOrdersForLaunch() {
  try {
    if (localStorage.getItem(STORAGE_KEYS.launchReset) === LAUNCH_RESET_VERSION) {
      return;
    }

    [
      "cakes-josy-silva-draft",
      "cakes-josy-silva-history",
      STORAGE_KEYS.draft,
      STORAGE_KEYS.history,
    ].forEach((key) => localStorage.removeItem(key));

    localStorage.setItem(STORAGE_KEYS.sequence, "1");
    localStorage.setItem(STORAGE_KEYS.launchReset, LAUNCH_RESET_VERSION);
  } catch (error) {
    // Se o navegador bloquear o armazenamento, a app continua a funcionar sem interromper a venda.
  }
}

resetStoredOrdersForLaunch();

const catalog = {
  tipos: [
    { id: "bolo", name: "Bolo decorado", price: 0, note: "Orçamento por kg, recheio e decoração.", icon: "B" },
    { id: "acetato", name: "Bolo no acetato", price: 0, note: "Mesmo cálculo por kg; decoração/topper só se for escolhido.", icon: "A" },
    { id: "kit", name: "Kit festa", price: 0, note: "Bolo, doces e salgados no mesmo pacote.", icon: "K" },
    { id: "avulsos", name: "Doces e salgados", price: 0, note: "Orçamento sem bolo decorado.", icon: "D" },
  ],
  kitTiposBolo: [
    { id: "decorado", name: "Bolo decorado", price: 0, note: "Bolo do kit em chantilly decorado conforme a opção do kit.", icon: "D" },
    { id: "acetato", name: "Bolo no acetato", price: 0, note: "Bolo do kit no acetato, mantendo o valor do kit escolhido.", icon: "A" },
  ],
  massas: [
    { id: "chocolate", name: "Chocolate", price: 0, note: "Massa clássica para bolos decorados.", icon: "C" },
    { id: "branca", name: "Massa branca", price: 0, note: "Massa branca sem acréscimo.", icon: "M" },
    { id: "baunilha", name: "Baunilha", price: 0, note: "Base leve para qualquer recheio.", icon: "B" },
    { id: "red-velvet", name: "Red velvet", price: 0, note: "Massa especial, sem acréscimo configurado.", icon: "R" },
    { id: "cenoura", name: "Cenoura", price: 0, note: "Massa de cenoura para pedidos decorados.", icon: "A" },
    { id: "mista", name: "Massa mista", price: 0, note: "Duas massas no mesmo bolo.", icon: "M" },
  ],
  recheios: [
    { id: "tradicional", name: "Tradicional", price: 20, note: "Brigadeiros, Prestígio, Ananás, Doce de leite, Casadinho, Dois amores e Chantilly.", icon: "T" },
    { id: "especial", name: "Especial", price: 22, note: "Leite Nido, nozes, cream cheese ou amendoim.", icon: "E" },
    { id: "gourmet", name: "Gourmet", price: 24, note: "Maracujá, Nido com morangos, Nutella, Ferrero, Kinder, Oreo ou pistachio.", icon: "G" },
  ],
  recheiosEspecificos: [
    { id: "brigadeiro-leite", category: "tradicional", name: "Brigadeiro ao leite", price: 0, note: "Categoria tradicional.", icon: "B" },
    { id: "brigadeiro-branco", category: "tradicional", name: "Brigadeiro branco", price: 0, note: "Categoria tradicional.", icon: "B" },
    { id: "prestigio", category: "tradicional", name: "Prestígio", price: 0, note: "Chocolate com coco.", icon: "P" },
    { id: "ananas-cremoso", category: "tradicional", name: "Ananás cremoso", price: 0, note: "Categoria tradicional, já contém fruta.", icon: "A", hasFruit: true },
    { id: "doce-leite", category: "tradicional", name: "Doce de leite cremoso", price: 0, note: "Categoria tradicional.", icon: "D" },
    { id: "doce-leite-coco", category: "tradicional", name: "Doce de leite com coco", price: 0, note: "Categoria tradicional.", icon: "D" },
    { id: "casadinho", category: "tradicional", name: "Casadinho", price: 0, note: "Categoria tradicional.", icon: "C" },
    { id: "dois-amores", category: "tradicional", name: "Dois amores", price: 0, note: "Categoria tradicional.", icon: "2" },
    { id: "chantilly", category: "tradicional", name: "Chantilly", price: 0, note: "Categoria tradicional.", icon: "C" },
    { id: "leite-nido", category: "especial", name: "Leite Nido", price: 0, note: "Categoria especial.", icon: "N" },
    { id: "nozes", category: "especial", name: "Brigadeiro de Nozes", price: 0, note: "Categoria especial.", icon: "N" },
    { id: "cream-cheese-brigadeiro", category: "especial", name: "Brigadeiro de Cream Cheese", price: 0, note: "Categoria especial.", icon: "C" },
    { id: "amendoim", category: "especial", name: "Brigadeiro de Amendoim", price: 0, note: "Categoria especial.", icon: "A" },
    { id: "maracuja", category: "gourmet", name: "Brigadeiro de Maracujá", price: 0, note: "Categoria gourmet.", icon: "M" },
    { id: "nido-morangos", category: "gourmet", name: "Leite Nido com morangos", price: 0, note: "Categoria gourmet, já contém fruta.", icon: "N", hasFruit: true },
    { id: "cream-cheese", category: "gourmet", name: "Cream Cheese", price: 0, note: "Categoria gourmet.", icon: "C" },
    { id: "nutella", category: "gourmet", name: "Nutella", price: 0, note: "Categoria gourmet.", icon: "N" },
    { id: "ferrero", category: "gourmet", name: "Ferrero Rocher", price: 0, note: "Categoria gourmet.", icon: "F" },
    { id: "kinder", category: "gourmet", name: "Kinder Bueno", price: 0, note: "Categoria gourmet.", icon: "K" },
    { id: "oreo", category: "gourmet", name: "Oreo", price: 0, note: "Categoria gourmet.", icon: "O" },
    { id: "pistachio", category: "gourmet", name: "Pistachio e brigadeiro", price: 0, note: "Categoria gourmet.", icon: "P" },
  ],
  kitRecheiosBaseIds: ["doce-leite", "brigadeiro-leite", "ananas-cremoso", "prestigio"],
  pesos: [
    { id: "1-2kg", name: "1,2 kg", kg: 1.2, people: 7, note: "Serve em média 7 pessoas.", icon: "1.2" },
    { id: "1-5kg", name: "1,5 kg", kg: 1.5, people: 10, note: "Serve em média 10 pessoas.", icon: "1.5" },
    { id: "2kg", name: "2,0 kg", kg: 2, people: 15, note: "Serve em média 15 pessoas.", icon: "2" },
    { id: "2-5kg", name: "2,5 kg", kg: 2.5, people: 20, note: "Serve em média 20 pessoas.", icon: "2.5" },
    { id: "3kg", name: "3,0 kg", kg: 3, people: 25, note: "Serve em média 25 pessoas.", icon: "3" },
    { id: "3-5kg", name: "3,5 kg", kg: 3.5, people: 30, note: "Serve em média 30 pessoas.", icon: "3.5" },
    { id: "4kg", name: "4,0 kg", kg: 4, people: 40, note: "Serve em média 40 pessoas.", icon: "4" },
    { id: "5kg", name: "5,0 kg", kg: 5, people: 50, note: "Serve em média 50 pessoas.", icon: "5" },
    { id: "6kg", name: "6,0 kg", kg: 6, people: 60, note: "Serve em média 60 pessoas.", icon: "6" },
  ],
  decoracoes: [
    { id: "sem", name: "Sem decoração extra", price: 0, note: "Bolo em chantilly sem topo/drip/flores/impressões.", icon: "S" },
    { id: "duas-cores", name: "Duas cores chantilly", price: 2, note: "Decoração simples com duas cores de chantilly.", icon: "2" },
    { id: "duas-cores-nome", name: "Duas cores chantilly + nome", price: 5, note: "Duas cores de chantilly com nome escrito.", icon: "N" },
    { id: "decorado", name: "Decoração personalizada", price: 10, note: "Topo, drip, flores ou impressão em papel fotográfico.", icon: "D" },
  ],
  formatos: [
    { id: "retangular", name: "Formato retangular", price: 0, note: "Formato padrão do bolo.", icon: "R" },
    { id: "redondo", name: "Formato redondo", price: 0, note: "Formato redondo normal, sem acréscimo.", icon: "O" },
    { id: "coracao", name: "Formato coração", price: 0, note: "Usa tabela própria: 1,5 kg 50 €, 2 kg 60 €, 3 kg 80 €.", icon: "C" },
  ],
  frutas: [
    { id: "sem-fruta", name: "Sem fruta extra", price: 0, note: "Não acrescenta fruta ao recheio.", icon: "S" },
    { id: "morango", name: "Morango extra", price: 1, note: "+1 €/kg, exceto recheios que já têm fruta.", icon: "M" },
    { id: "ananas", name: "Ananás extra", price: 1, note: "+1 €/kg, exceto recheios que já têm fruta.", icon: "A" },
    { id: "frutos-vermelhos", name: "Frutos vermelhos", price: 1, note: "+1 €/kg, exceto recheios que já têm fruta.", icon: "F" },
  ],
  kits: [
    { id: "kit-6", name: "Kit 6 pessoas - acetato", price: 68, note: "1 kg bolo no acetato, 25 doces e 50 salgados.", icon: "6", boloKg: 1, doces: 25, salgados: 50 },
    { id: "kit-6-decorado", name: "Kit 6 pessoas - com decoração", price: 78, note: "1 kg bolo decorado, 25 doces, 50 salgados e decoração.", icon: "6+", boloKg: 1, doces: 25, salgados: 50 },
    { id: "kit-10", name: "Kit 10 pessoas - acetato", price: 80, note: "1,5 kg bolo no acetato, 30 doces e 80 salgados.", icon: "10", boloKg: 1.5, doces: 30, salgados: 80 },
    { id: "kit-10-decorado", name: "Kit 10 pessoas - com decoração", price: 90, note: "1,5 kg bolo decorado, 30 doces, 80 salgados e decoração.", icon: "10+", boloKg: 1.5, doces: 30, salgados: 80 },
    { id: "kit-20", name: "Kit 15-20 pessoas - acetato", price: 115, note: "2 kg bolo no acetato, 40 doces e 120 salgados.", icon: "20", boloKg: 2, doces: 40, salgados: 120 },
    { id: "kit-20-decorado", name: "Kit 15-20 pessoas - com decoração", price: 125, note: "2 kg bolo decorado, 40 doces, 120 salgados e decoração.", icon: "20+", boloKg: 2, doces: 40, salgados: 120 },
    { id: "kit-30", name: "Kit 25-30 pessoas - acetato", price: 175, note: "3 kg bolo no acetato, 50 doces e 200 salgados.", icon: "30", boloKg: 3, doces: 50, salgados: 200 },
    { id: "kit-30-decorado", name: "Kit 25-30 pessoas - com decoração", price: 185, note: "3 kg bolo decorado, 50 doces, 200 salgados e decoração.", icon: "30+", boloKg: 3, doces: 50, salgados: 200 },
  ],
  salgados: [
    { id: "salgados-25", name: "Mini salgados - 25 un", price: 18, note: "Coxinha, rissoles, kibe, croquete ou bolinha de queijo." },
    { id: "salgados-50", name: "Mini salgados - 50 un", price: 28, note: "Coxinha, rissoles, kibe, croquete ou bolinha de queijo." },
    { id: "salgados-100", name: "Mini salgados - 100 un/personalizado", customLabel: "Mini salgados", price: 45, unitPrice: 0.45, defaultQuantity: 100, customQuantity: true, note: "100 un = 45 €. Para outra quantidade, escreva abaixo." },
    { id: "empadas-12", name: "Mini empadas - 12 un", price: 14, note: "Mini empadas de galinha." },
    { id: "empadas-20", name: "Mini empadas - 20 un", price: 23, note: "Mini empadas de galinha." },
    { id: "empadas-40", name: "Mini empadas - 40 un", price: 40, note: "Mini empadas de galinha." },
  ],
  doces: [
    { id: "tradicionais-20", name: "Doces tradicionais - 20 un", price: 18, note: "Brigadeiro, beijinho e opções tradicionais." },
    { id: "tradicionais-50", name: "Doces tradicionais - 50 un", price: 30, note: "Brigadeiro, beijinho e opções tradicionais." },
    { id: "tradicionais-100", name: "Doces tradicionais - 100 un", price: 49, note: "Brigadeiro, beijinho e opções tradicionais." },
    { id: "gourmet-20", name: "Doces especiais - 20 un", price: 25, note: "Doces gourmet/especiais." },
    { id: "gourmet-50", name: "Doces especiais - 50 un", price: 45, note: "Doces gourmet/especiais." },
  ],
  outrosProdutos: [
    {
      id: "mini-bolo",
      name: "Mini bolo",
      price: 9.5,
      note: "Escreva os sabores.",
      textOptionLabel: "Sabor(es)",
      textOptionPlaceholder: "Ex: Prestígio, Brigadeiro",
    },
    { id: "pao-mel", name: "Pão de mel", price: 4, note: "Unidade." },
    { id: "tarte", name: "Tarte", price: 3.8, note: "Salgado grande." },
    { id: "empada-grande", name: "Empada grande", price: 2.5, note: "Salgado grande." },
    { id: "coxinha-grande", name: "Coxinha grande", price: 2.5, note: "Salgado grande." },
    { id: "pao-misto", name: "Pão com misto", price: 2.5, note: "Salgado grande." },
    { id: "brigadeiro-uva", name: "Brigadeiro de uva", price: 4.5, note: "Unidade." },
    { id: "brigadeiro-morango", name: "Brigadeiro de morango", price: 4.5, note: "Unidade." },
    {
      id: "trufa",
      name: "Trufas recheadas",
      price: 2.5,
      note: "Escreva os sabores.",
      textOptionLabel: "Sabor(es)",
      textOptionPlaceholder: "Ex: Maracujá, Leite Nido",
    },
    {
      id: "cone",
      name: "Cone trufado",
      price: 3.8,
      note: "Escreva os sabores.",
      textOptionLabel: "Sabor(es)",
      textOptionPlaceholder: "Ex: Kinder Bueno, Pistácio",
    },
    { id: "carolina", name: "Carolina", price: 1.5, note: "Unidade." },
    {
      id: "bolo-pote",
      name: "Bolo de pote",
      price: 4,
      note: "Escreva os sabores.",
      textOptionLabel: "Sabor(es)",
      textOptionPlaceholder: "Ex: Doce de leite, Ananás",
    },
    { id: "copo-pudim", name: "Copo de pudim", price: 5, note: "Unidade." },
    {
      id: "bolo-gelado",
      name: "Bolo gelado",
      price: 4,
      note: "Escreva os sabores.",
      textOptionLabel: "Sabor(es)",
      textOptionPlaceholder: "Ex: Leite Nido, Prestígio",
    },
    { id: "bolo-pudim-fatia", name: "Bolo pudim - fatia", price: 5, note: "Fatia." },
    { id: "fatia-bolo", name: "Fatia de bolo", price: 6, note: "Fatia." },
    { id: "topo-parabens", name: "Topo parabéns", price: 3.5, note: "Topo pré-pronto." },
    { id: "topo-aniversario", name: "Topo aniversário", price: 4, note: "Topo pré-pronto." },
    { id: "topo-variedades", name: "Topo outras variedades", price: 4, note: "Topo pré-pronto." },
    {
      id: "vela-numero",
      name: "Vela número",
      price: 1.5,
      note: "Escolha número e cor.",
      textOptionLabel: "Número(s)",
      textOptionPlaceholder: "Ex: 3, 5",
      secondaryOptionsLabel: "Cor",
      secondaryOptions: ["Ouro", "Prata"],
    },
    { id: "vela-foguete", name: "Vela foguete", price: 3.5, note: "Unidade." },
    { id: "vela-lisa", name: "Vela lisa simples", price: 1, note: "Unidade." },
  ],
  salgadoSabores: "coxinha, rissoles fiambre/queijo, kibe, croquete carne, bolinha de queijo",
  doceSabores: "brigadeiro, beijinho e variedades disponíveis da loja",
};

const steps = [
  { key: "tipo", title: "Escolha o tipo de orçamento", description: "Defina se o cliente quer bolo, kit festa ou itens avulsos.", type: "single", options: catalog.tipos },
  { key: "massa", title: "Escolha a massa do bolo", description: "Selecione a massa que o cliente deseja.", type: "single", options: catalog.massas },
  { key: "recheio", title: "Escolha a categoria do recheio", description: "O valor do bolo é calculado pelo preço por kg do recheio.", type: "single", options: catalog.recheios },
  { key: "recheioOpcao", title: "Escolha o recheio específico", description: "Selecione o sabor exato dentro da categoria escolhida.", type: "single", options: [] },
  { key: "peso", title: "Escolha o peso", description: "O preço base do bolo é peso x preço por kg.", type: "single", options: catalog.pesos },
  { key: "segundoRecheio", title: "Deseja adicionar segundo recheio?", description: "Disponível somente a partir de 1,5 kg. Se for de outra categoria, o cálculo é feito metade/metade.", type: "single", options: [] },
  { key: "fruta", title: "Adicionar fruta extra?", description: "Morango, ananás ou frutos vermelhos acrescentam 1 €/kg quando aplicável.", type: "single", options: catalog.frutas },
  { key: "decoracao", title: "Escolha a decoração", description: "Trabalhamos com chantilly; escolha sem extra, duas cores, nome ou decoração personalizada.", type: "single", options: catalog.decoracoes },
  { key: "formato", title: "Escolha o formato do bolo", description: "Selecione retangular, redondo ou coração. Coração usa tabela própria.", type: "single", options: catalog.formatos },
  { key: "kit", title: "Escolha o kit festa", description: "Selecione o pacote com bolo, doces e salgados.", type: "single", options: catalog.kits },
  { key: "kitRecheio", title: "Recheio incluído no kit", description: "Estes são os recheios incluídos no valor base do kit. Outros recheios entram como à parte.", type: "single", options: [] },
  { key: "kitRecheioOpcao", title: "Escolha o recheio à parte", description: "Lista completa de recheios. O acréscimo é calculado pelo peso do bolo do kit.", type: "single", options: [] },
  { key: "salgados", title: "Adicionar salgados?", description: "Marque os salgados que o cliente deseja incluir.", type: "multi", options: catalog.salgados },
  { key: "salgadosDetalhe", title: "Tipos de salgados", description: "Informe se será mix ou quais sabores o cliente quer.", type: "variety", itemType: "salgados" },
  { key: "doces", title: "Adicionar doces?", description: "Marque os doces que entram no mesmo orçamento.", type: "multi", options: catalog.doces },
  { key: "docesDetalhe", title: "Tipos de doces", description: "Informe se será mix ou quais doces o cliente quer.", type: "variety", itemType: "doces" },
  { key: "outrosProdutos", title: "Deseja adicionar mais algum produto?", description: "Adicione produtos prontos, velas, topos ou itens de loja.", type: "products" },
  { key: "dados", title: "Dados do cliente", description: "Preencha as informações para agendar e imprimir.", type: "details" },
  { key: "final", title: "Orçamento final", description: "Confira os detalhes antes de imprimir o pedido.", type: "final" },
];

const state = {
  tipo: catalog.tipos[0],
  massa: catalog.massas[0],
  recheio: catalog.recheios[0],
  recheioOpcao: catalog.recheiosEspecificos[0],
  segundoRecheio: null,
  peso: catalog.pesos[0],
  fruta: catalog.frutas[0],
  decoracao: catalog.decoracoes[0],
  formato: catalog.formatos[0],
  kit: catalog.kits[0],
  kitTipoBolo: catalog.kitTiposBolo[0],
  kitRecheio: catalog.recheiosEspecificos.find((option) => option.id === "doce-leite"),
  salgados: [],
  salgadosDetalhe: {
    mode: "mix",
    text: "",
  },
  doces: [],
  docesDetalhe: {
    mode: "mix",
    text: "",
  },
  outrosProdutos: [],
  dados: {
    nome: "",
    telefone: "",
    data: "",
    hora: "15:00",
    observacoes: "",
  },
  pagamento: {
    percent: 0,
    status: "blank",
  },
};

let currentStep = 0;
let currentReceiptCode = "0001";
let persistenceReady = false;

const stepTitle = document.querySelector("#step-title");
const stepDescription = document.querySelector("#step-description");
const stepContent = document.querySelector("#step-content");
const progressFill = document.querySelector("#progress-fill");
const progressLabel = document.querySelector("#progress-label");
const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");
const resumeOrderButton = document.querySelector("#resume-order-button");
const historyButton = document.querySelector("#history-button");
const resetOrdersButton = document.querySelector("#reset-orders-button");
const newOrderButton = document.querySelector("#new-order-button");
const liveSummary = document.querySelector("#live-summary");
const liveTotal = document.querySelector("#live-total");
const printArea = document.querySelector("#print-area");

function getTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function formatReceiptCode(number) {
  return String(Math.max(1, Number(number) || 1)).padStart(4, "0");
}

function getNextReceiptCode() {
  try {
    return formatReceiptCode(localStorage.getItem(STORAGE_KEYS.sequence) || 1);
  } catch (error) {
    return "0001";
  }
}

function advanceReceiptCodeAfterSave(code) {
  try {
    const currentSequence = Math.max(1, Number(localStorage.getItem(STORAGE_KEYS.sequence)) || 1);
    const savedNumber = Math.max(1, Number(code) || currentSequence);
    localStorage.setItem(STORAGE_KEYS.sequence, String(Math.max(currentSequence, savedNumber + 1)));
  } catch (error) {
    // Se o navegador bloquear o armazenamento, a app continua a imprimir o pedido atual.
  }
}

function isSunday(dateValue) {
  if (!dateValue) {
    return false;
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day).getDay() === 0;
}

function getDateInfo(dateValue) {
  if (!dateValue) {
    return {
      weekday: "",
      date: "",
    };
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = new Intl.DateTimeFormat("pt-PT", { weekday: "long" }).format(date);
  const displayWeekday = weekday.replace("-", "\u2011");

  return {
    weekday: displayWeekday.charAt(0).toUpperCase() + displayWeekday.slice(1),
    date: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`,
  };
}

function calculateTotal() {
  const fruitTotal = getFruitTotal();
  const cakeBase = calculateCakeBase();
  const decorationTotal = getDecorationTotal();
  const cakeTotal =
    ["bolo", "acetato"].includes(state.tipo.id)
      ? cakeBase + fruitTotal + decorationTotal
      : 0;
  const kitTotal = state.tipo.id === "kit" ? state.kit.price + calculateKitFillingExtra() : 0;
  const saltyTotal = state.salgados.reduce((total, item) => total + getSaltyItemTotal(item), 0);
  const sweetTotal = state.doces.reduce((total, item) => total + item.price, 0);
  const productTotal = state.outrosProdutos.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  return cakeTotal + kitTotal + saltyTotal + sweetTotal + productTotal;
}

function getFillingPriceByCategory(category) {
  return catalog.recheios.find((recheio) => recheio.id === category)?.price || catalog.recheios[0].price;
}

function calculateKitFillingExtra() {
  if (state.tipo.id !== "kit" || state.kitRecheio?.id !== "kit-recheio-a-parte") {
    return 0;
  }

  return getKitFillingExtraForOption(state.recheioOpcao);
}

function getKitFillingExtraForOption(option) {
  if (!option?.category) {
    return 0;
  }

  const basePrice = catalog.recheios[0].price;
  const categoryPrice = getFillingPriceByCategory(option.category);
  const kiloDifference = Math.max(0, categoryPrice - basePrice);
  return kiloDifference * (state.kit.boloKg || 0);
}

function getFillingCategoryName(category) {
  return catalog.recheios.find((recheio) => recheio.id === category)?.name || "Tradicional";
}

function getDefaultKitExtraFilling() {
  return catalog.recheiosEspecificos.find((option) => !catalog.kitRecheiosBaseIds.includes(option.id)) || catalog.recheiosEspecificos[0];
}

function getKitIncludedFillingOptions() {
  const included = catalog.kitRecheiosBaseIds
    .map((id) => catalog.recheiosEspecificos.find((option) => option.id === id))
    .filter(Boolean)
    .map((option) => ({
      ...option,
      note: "Incluído no valor base do kit.",
    }));

  return [
    ...included,
    {
      id: "kit-recheio-a-parte",
      name: "Outro recheio à parte",
      category: "a-parte",
      price: 0,
      note: "Abrir lista completa de recheios e calcular acréscimo quando aplicável.",
      icon: "+",
    },
  ];
}

function formatKitFillingDescription() {
  if (state.kitRecheio?.id !== "kit-recheio-a-parte") {
    return `${state.kitRecheio?.name || state.recheioOpcao.name} (incluído)`;
  }

  return `${state.recheioOpcao.name} - ${getFillingCategoryName(state.recheioOpcao.category)} (à parte)`;
}

function calculateMixedFillingPrice() {
  if (!state.segundoRecheio || state.peso.kg < 1.5) {
    return state.recheio.price * state.peso.kg;
  }

  const halfWeight = state.peso.kg / 2;
  const secondPrice = getFillingPriceByCategory(state.segundoRecheio.category);
  return state.recheio.price * halfWeight + secondPrice * halfWeight;
}

function calculateHeartCakeBase() {
  const traditionalHeartPrices = {
    1.5: 50,
    2: 60,
    3: 80,
  };
  const basePrice = traditionalHeartPrices[state.peso.kg];

  if (!basePrice) {
    return calculateMixedFillingPrice() + state.formato.price;
  }

  const traditionalPrice = catalog.recheios[0].price;

  if (!state.segundoRecheio || state.peso.kg < 1.5) {
    return basePrice + (state.recheio.price - traditionalPrice) * state.peso.kg;
  }

  const halfWeight = state.peso.kg / 2;
  const secondPrice = getFillingPriceByCategory(state.segundoRecheio.category);

  return (
    basePrice +
    (state.recheio.price - traditionalPrice) * halfWeight +
    (secondPrice - traditionalPrice) * halfWeight
  );
}

function calculateCakeBase() {
  if (state.formato.id === "coracao") {
    return calculateHeartCakeBase();
  }

  return calculateMixedFillingPrice() + state.formato.price;
}

function formatCakeBaseDescription() {
  if (state.formato.id === "coracao") {
    return "Tabela coração aplicada";
  }

  return `${state.formato.name} (${money.format(state.formato.price)})`;
}

function formatDecorationDescription() {
  if (state.formato.id === "coracao") {
    return `${state.decoracao.name} (sem efeito na tabela coração)`;
  }

  return `${state.decoracao.name} (${money.format(state.decoracao.price)})`;
}

function getFruitTotal() {
  return state.recheioOpcao.hasFruit ? 0 : state.fruta.price * state.peso.kg;
}

function getDecorationTotal() {
  return state.formato.id === "coracao" ? 0 : state.decoracao.price;
}

function formatCakePriceDetails() {
  const base = calculateCakeBase();
  const fruit = getFruitTotal();
  const decoration = getDecorationTotal();
  const total = base + fruit + decoration;
  const details = [`base ${money.format(base)}`];

  if (fruit) {
    details.push(`fruta ${money.format(fruit)}`);
  }

  if (decoration) {
    details.push(`decoração ${money.format(decoration)}`);
  }

  return `${money.format(total)} (${details.join(" + ")})`;
}

function formatSecondFilling() {
  if (!state.segundoRecheio || state.peso.kg < 1.5) {
    return "Não contém";
  }

  return `${state.segundoRecheio.name} (${getFillingCategoryName(state.segundoRecheio.category)})`;
}

function calculatePayment() {
  const total = calculateTotal();
  const paid = total * (state.pagamento.percent / 100);

  return {
    paid,
    remaining: total - paid,
  };
}

function getPaymentLabel() {
  if (state.pagamento.status === "awaiting") {
    return "Aguarda pagamento";
  }

  return state.pagamento.percent ? `${state.pagamento.percent}%` : "Em branco";
}

function getPaidValue() {
  if (state.pagamento.status === "awaiting") {
    return money.format(0);
  }

  return state.pagamento.percent ? money.format(calculatePayment().paid) : "__________";
}

function getRemainingValue() {
  if (state.pagamento.status === "awaiting") {
    return money.format(calculateTotal());
  }

  return state.pagamento.percent ? money.format(calculatePayment().remaining) : "__________";
}

function normalizeSalgadoItem(item) {
  if (!item?.customQuantity) {
    return item;
  }

  const catalogItem = catalog.salgados.find((option) => option.id === item.id) || item;
  const quantity = Math.max(1, Number(item.quantity) || catalogItem.defaultQuantity || 100);

  return {
    ...catalogItem,
    ...item,
    quantity,
    price: quantity * (catalogItem.unitPrice || item.unitPrice || 0),
  };
}

function getSaltyItemTotal(item) {
  if (!item?.customQuantity) {
    return item.price || 0;
  }

  return normalizeSalgadoItem(item).price || 0;
}

function getActiveSteps() {
  return steps.filter((step) => {
    if (["bolo", "acetato"].includes(state.tipo.id)) {
      if (step.key === "kit") {
        return false;
      }
      if (["kitRecheio", "kitRecheioOpcao"].includes(step.key)) {
        return false;
      }
      if (step.key === "segundoRecheio") {
        return state.peso.kg >= 1.5;
      }
      if (step.key === "salgadosDetalhe") {
        return state.salgados.length > 0;
      }
      if (step.key === "docesDetalhe") {
        return state.doces.length > 0;
      }
      return true;
    }

    if (state.tipo.id === "kit") {
      return [
        "tipo",
        "kit",
        "massa",
        "kitRecheio",
        ...(state.kitRecheio?.id === "kit-recheio-a-parte" ? ["kitRecheioOpcao"] : []),
        "salgadosDetalhe",
        "docesDetalhe",
        "outrosProdutos",
        "dados",
        "final",
      ].includes(step.key);
    }

    if (step.key === "salgadosDetalhe") {
      return state.salgados.length > 0;
    }
    if (step.key === "docesDetalhe") {
      return state.doces.length > 0;
    }

    return ["tipo", "salgados", "salgadosDetalhe", "doces", "docesDetalhe", "outrosProdutos", "dados", "final"].includes(step.key);
  });
}

function getKitQuantityLabel(itemType) {
  if (state.tipo.id !== "kit" || !state.kit?.[itemType]) {
    return "";
  }

  return `${state.kit[itemType]} ${itemType === "salgados" ? "salgados" : "doces"}`;
}

function formatVariety(detail, fallbackMix, quantityLabel = "") {
  const prefix = quantityLabel ? `${quantityLabel} - ` : "";

  if (detail.mode === "mix") {
    return `${prefix}Mix (${fallbackMix})`;
  }

  if (detail.mode === "2") {
    return `${prefix}2 tipos: ${detail.text || "por preencher"}`;
  }

  if (detail.mode === "4") {
    return `${prefix}4 tipos: ${detail.text || "por preencher"}`;
  }

  return `${prefix}${detail.text || "Personalizado por preencher"}`;
}

function formatProducts(items) {
  if (!items.length) {
    return "Não incluído";
  }

  return items
    .map((item) => {
      const details = [item.option, item.secondaryOption].filter(Boolean).join(" - ");
      const detailText = details ? ` - ${details}` : "";
      return `${item.quantity}x ${item.name}${detailText} (${money.format(item.price * item.quantity)})`;
    })
    .join(", ");
}

function getStepOptions(step) {
  if (step.key === "kitRecheio") {
    return getKitIncludedFillingOptions();
  }

  if (step.key === "kitRecheioOpcao") {
    return catalog.recheiosEspecificos.map((option) => {
      const categoryName = getFillingCategoryName(option.category);
      const extra = getKitFillingExtraForOption(option);

      return {
        ...option,
        note: `${categoryName}. Acréscimo no kit: ${money.format(extra)}.`,
      };
    });
  }

  if (step.key === "recheioOpcao") {
    return catalog.recheiosEspecificos.filter((option) => option.category === state.recheio.id);
  }

  if (step.key === "segundoRecheio") {
    return [
      { id: "sem-segundo-recheio", name: "Não contém segundo recheio", price: 0, note: "Seguir com apenas um recheio.", icon: "N" },
      ...catalog.recheiosEspecificos,
    ];
  }

  if (step.key === "formato" && state.peso.kg < 1.5) {
    return step.options.filter((option) => option.id !== "coracao");
  }

  return step.options;
}

function formatItems(items) {
  return items.length
    ? items.map((item) => {
        if (item.customQuantity) {
          const normalized = normalizeSalgadoItem(item);
          return `${normalized.customLabel || normalized.name} - ${normalized.quantity} un (${money.format(normalized.price)})`;
        }

        return `${item.name} (${money.format(item.price)})`;
      }).join(", ")
    : "Não incluído";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getOrderSnapshot() {
  return {
    state: JSON.parse(JSON.stringify(state)),
    currentStep,
    currentReceiptCode,
    updatedAt: new Date().toISOString(),
  };
}

function getStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function setStoredJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    alert("Não foi possível guardar os dados neste navegador.");
  }
}

function normalizeSavedState(savedState) {
  return {
    ...savedState,
    kitTipoBolo: savedState.kitTipoBolo || catalog.kitTiposBolo[0],
    kitRecheio: savedState.kitRecheio || catalog.recheiosEspecificos.find((option) => option.id === "doce-leite"),
    salgados: (savedState.salgados || []).map(normalizeSalgadoItem),
    salgadosDetalhe: savedState.salgadosDetalhe || { mode: "mix", text: "" },
    doces: savedState.doces || [],
    docesDetalhe: savedState.docesDetalhe || { mode: "mix", text: "" },
    outrosProdutos: savedState.outrosProdutos || [],
    dados: {
      nome: "",
      telefone: "",
      data: getTomorrow(),
      hora: "15:00",
      observacoes: "",
      ...(savedState.dados || {}),
    },
    pagamento: {
      percent: 0,
      status: "blank",
      ...(savedState.pagamento || {}),
    },
  };
}

function restoreSnapshot(snapshot) {
  if (!snapshot?.state) {
    return false;
  }

  Object.assign(state, normalizeSavedState(snapshot.state));
  currentStep = Number.isInteger(snapshot.currentStep) ? snapshot.currentStep : 0;
  currentReceiptCode = snapshot.currentReceiptCode || getNextReceiptCode();
  render();
  return true;
}

function updateStorageButtons() {
  const draft = getStoredJson(STORAGE_KEYS.draft, null);
  const history = getStoredJson(STORAGE_KEYS.history, []);

  if (resumeOrderButton) {
    resumeOrderButton.disabled = !draft;
  }

  if (historyButton) {
    historyButton.disabled = history.length === 0;
  }
}

function saveDraft() {
  if (!persistenceReady) {
    return;
  }

  setStoredJson(STORAGE_KEYS.draft, getOrderSnapshot());
  updateStorageButtons();
}

function loadDraft({ silent = false } = {}) {
  const draft = getStoredJson(STORAGE_KEYS.draft, null);

  if (!draft) {
    if (!silent) {
      alert("Ainda não há pedido guardado para continuar.");
    }
    updateStorageButtons();
    return false;
  }

  return restoreSnapshot(draft);
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEYS.draft);
  } catch (error) {
    // Se o navegador bloquear a limpeza, o próximo pedido continua funcionando.
  }
  updateStorageButtons();
}

function resetStoredOrders() {
  try {
    [
      "cakes-josy-silva-draft",
      "cakes-josy-silva-history",
      STORAGE_KEYS.draft,
      STORAGE_KEYS.history,
    ].forEach((key) => localStorage.removeItem(key));

    localStorage.setItem(STORAGE_KEYS.sequence, "1");
    localStorage.setItem(STORAGE_KEYS.launchReset, LAUNCH_RESET_VERSION);
    updateStorageButtons();
    return true;
  } catch (error) {
    alert("Nao foi possivel reiniciar os pedidos neste navegador.");
    return false;
  }
}

function saveHistoryEntry() {
  const history = getStoredJson(STORAGE_KEYS.history, []);
  const alreadySaved = history.some((item) => item.code === currentReceiptCode);
  const entry = {
    id: `${Date.now()}`,
    code: currentReceiptCode,
    savedAt: new Date().toISOString(),
    customer: state.dados.nome || "Cliente sem nome",
    phone: state.dados.telefone || "",
    total: calculateTotal(),
    snapshot: getOrderSnapshot(),
  };
  const nextHistory = [
    entry,
    ...history.filter((item) => item.code !== currentReceiptCode),
  ].slice(0, 50);

  setStoredJson(STORAGE_KEYS.history, nextHistory);
  if (!alreadySaved) {
    advanceReceiptCodeAfterSave(currentReceiptCode);
  }
  updateStorageButtons();
}

function buildWhatsAppMessage() {
  const dateInfo = getDateInfo(state.dados.data);
  const scheduleLine = state.dados.data
    ? `Entrega/retirada: ${dateInfo.weekday}, ${dateInfo.date}${state.dados.hora ? ` às ${state.dados.hora}` : ""}`
    : "";
  const lines = [
    `*Pedido #${currentReceiptCode}*`,
    state.dados.nome ? `Cliente: ${state.dados.nome}` : "",
    state.dados.telefone ? `Telefone: ${state.dados.telefone}` : "",
    scheduleLine,
    "",
    ...receiptRows()
      .filter(([, value]) => String(value || "").trim())
      .map(([label, value]) => `*${label}:* ${value}`),
    "",
    `*Total:* ${money.format(calculateTotal())}`,
    `*Pagamento:* ${getPaymentLabel()}`,
    `*Valor pago:* ${getPaidValue()}`,
    `*Valor em falta:* ${getRemainingValue()}`,
  ];

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("copy-failed");
  }
}

function openOrderInWhatsApp() {
  const message = buildWhatsAppMessage();
  saveHistoryEntry();
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const popup = window.open(url, "_blank", "noopener,noreferrer");

  if (!popup) {
    window.location.href = url;
  }
}

async function copyOrderMessage() {
  try {
    await copyTextToClipboard(buildWhatsAppMessage());
    saveHistoryEntry();
    alert("Mensagem copiada. Agora e so colar no WhatsApp.");
  } catch (error) {
    alert("Nao consegui copiar automaticamente a mensagem neste navegador.");
  }
}

function showHistory() {
  const history = getStoredJson(STORAGE_KEYS.history, []);

  if (!history.length) {
    alert("Ainda não há pedidos no histórico.");
    updateStorageButtons();
    return;
  }

  const list = history
    .slice(0, 20)
    .map((item, index) => {
      const date = new Date(item.savedAt).toLocaleString("pt-PT");
      return `${index + 1}. ${item.customer} - ${money.format(item.total)} - ${date}`;
    })
    .join("\n");
  const choice = prompt(`Histórico de pedidos\n\n${list}\n\nDigite o número para reabrir e imprimir novamente.`);
  const index = Number(choice) - 1;

  if (!choice) {
    return;
  }

  if (!history[index]?.snapshot) {
    alert("Número inválido.");
    return;
  }

  restoreSnapshot(history[index].snapshot);
}

function isSelected(key, option) {
  if (Array.isArray(state[key])) {
    return state[key].some((item) => item.id === option.id);
  }
  if (key === "segundoRecheio" && state.segundoRecheio === null) {
    return option.id === "sem-segundo-recheio";
  }
  if (key === "kitRecheioOpcao") {
    return state.recheioOpcao?.id === option.id;
  }
  return state[key]?.id === option.id;
}

function selectSingle(key, optionId) {
  const step = getActiveSteps()[currentStep];
  const selectedOption = getStepOptions(step).find((option) => option.id === optionId);

  if (key === "segundoRecheio") {
    state.segundoRecheio = optionId === "sem-segundo-recheio" ? null : selectedOption;
    render();
    return;
  }

  if (key === "kitRecheio") {
    state.kitRecheio = selectedOption;
    if (optionId !== "kit-recheio-a-parte") {
      state.recheio = catalog.recheios[0];
      state.recheioOpcao = selectedOption;
    } else {
      const defaultFilling = getDefaultKitExtraFilling();
      state.recheioOpcao = defaultFilling;
      state.recheio = catalog.recheios.find((recheio) => recheio.id === defaultFilling.category) || catalog.recheios[0];
    }
    if (optionId === "kit-recheio-a-parte") {
      currentStep = getActiveSteps().findIndex((activeStep) => activeStep.key === "kitRecheioOpcao");
    }
    render();
    return;
  }

  if (key === "kitRecheioOpcao") {
    state.recheioOpcao = selectedOption;
    state.recheio = catalog.recheios.find((recheio) => recheio.id === selectedOption.category) || catalog.recheios[0];
    render();
    return;
  }

  state[key] = selectedOption;
  if (key === "tipo") {
    currentStep = 0;
    state.recheio = catalog.recheios[0];
    state.recheioOpcao = catalog.recheiosEspecificos[0];
    state.kitRecheio = catalog.recheiosEspecificos.find((option) => option.id === "doce-leite");
    state.segundoRecheio = null;
  }
  if (key === "recheio") {
    state.recheioOpcao = catalog.recheiosEspecificos.find((option) => option.category === state.recheio.id);
    state.segundoRecheio = null;
    state.fruta = catalog.frutas[0];
  }
  if (key === "peso" && state.peso.kg < 1.5) {
    state.segundoRecheio = null;
  }
  if (key === "peso" && state.peso.kg < 1.5 && state.formato.id === "coracao") {
    state.formato = catalog.formatos[0];
  }
  render();
}

function toggleMulti(key, optionId) {
  const step = getActiveSteps()[currentStep];
  const option = getStepOptions(step).find((item) => item.id === optionId);
  const exists = state[key].some((item) => item.id === optionId);
  const itemToAdd = option?.customQuantity ? normalizeSalgadoItem({ ...option, quantity: option.defaultQuantity || 100 }) : option;
  state[key] = exists ? state[key].filter((item) => item.id !== optionId) : [...state[key], itemToAdd];
  if (state[key].length === 0 && state[`${key}Detalhe`]) {
    state[`${key}Detalhe`] = {
      mode: "mix",
      text: "",
    };
  }
  render();
}

function updateCustomQuantity(key, optionId, quantity) {
  state[key] = state[key].map((item) =>
    item.id === optionId ? normalizeSalgadoItem({ ...item, quantity }) : item,
  );
  updateSummary();
}

function getOptionPriceText(step, option) {
  if (step.key === "peso") {
    return `${option.kg.toLocaleString("pt-PT")} kg`;
  }

  if (step.key === "recheio") {
    if (state.tipo.id === "kit") {
      const extraPerKg = Math.max(0, option.price - catalog.recheios[0].price);
      return extraPerKg ? `+ ${money.format(extraPerKg)} / kg` : "Sem acréscimo automático";
    }

    return `${money.format(option.price)} / kg`;
  }

  if (step.key === "kitRecheioOpcao") {
    const extra = getKitFillingExtraForOption(option);
    return extra ? `+ ${money.format(extra)}` : "Sem acréscimo";
  }

  if (step.key === "kitRecheio") {
    return option.id === "kit-recheio-a-parte" ? "À parte" : "Incluído";
  }

  if (step.key === "fruta" && option.price) {
    return `+ ${money.format(option.price)} / kg`;
  }

  return option.price ? money.format(option.price) : "Incluído";
}

function renderChoiceStep(step) {
  const options = getStepOptions(step);

  stepContent.innerHTML = `
    <div class="choice-grid">
      ${options
        .map(
          (option) => `
            <button class="choice-card ${isSelected(step.key, option) ? "selected" : ""}"
              type="button"
              data-id="${option.id}">
              <span class="choice-icon">${option.icon}</span>
              <h3>${option.name}</h3>
              <p>${option.note}</p>
              <span class="price-tag">${getOptionPriceText(step, option)}</span>
            </button>
          `,
        )
        .join("")}
    </div>
  `;

  stepContent.querySelectorAll(".choice-card").forEach((card) => {
    card.addEventListener("click", () => selectSingle(step.key, card.dataset.id));
  });
}

function renderMultiStep(step) {
  stepContent.innerHTML = `
    <div class="addons-grid">
      ${step.options
        .map((option) => {
          const selected = state[step.key].find((item) => item.id === option.id);
          const optionPrice = selected?.customQuantity ? getSaltyItemTotal(selected) : option.price;

          return `
            <label class="addon-card ${selected ? "selected" : ""} ${option.customQuantity ? "has-custom" : ""}">
              <input type="checkbox" value="${option.id}" ${isSelected(step.key, option) ? "checked" : ""}>
              <span>
                <strong>${option.name}</strong>
                <span>${option.note} ${money.format(optionPrice)}</span>
              </span>
              ${
                option.customQuantity && selected
                  ? `
                    <div class="addon-custom-quantity">
                      Quantidade
                      <input type="number" min="1" step="1" value="${selected.quantity || option.defaultQuantity || 100}" data-custom-quantity="${option.id}">
                      <span>${money.format(option.unitPrice)} por unidade</span>
                    </div>
                  `
                  : ""
              }
            </label>
          `;
        })
        .join("")}
    </div>
  `;

  stepContent.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener("change", () => toggleMulti(step.key, input.value));
  });

  stepContent.querySelectorAll("[data-custom-quantity]").forEach((input) => {
    input.addEventListener("input", () => {
      updateCustomQuantity(step.key, input.dataset.customQuantity, input.value);
    });
  });
}

function getCurrentStepTitle(step) {
  if (state.tipo.id === "kit" && step.key === "massa") {
    return "Escolha a massa do bolo do kit";
  }

  if (state.tipo.id === "kit" && step.key === "kitRecheioOpcao") {
    return "Escolha o recheio à parte";
  }

  return step.title;
}

function getCurrentStepDescription(step) {
  if (state.tipo.id === "kit" && step.key === "massa") {
    return "Selecione a massa do bolo incluído no kit festa.";
  }

  if (state.tipo.id === "kit" && step.key === "kitRecheioOpcao") {
    return "Lista completa de recheios. O acréscimo é calculado pelo peso do bolo do kit.";
  }

  return step.description;
}

function renderVarietyStep(step) {
  const detailKey = `${step.itemType}Detalhe`;
  const detail = state[detailKey];
  const needsText = detail.mode !== "mix";
  const kitQuantityLabel = getKitQuantityLabel(step.itemType);
  const kitQuantityNote = kitQuantityLabel
    ? `<div class="kit-quantity-note"><strong>${kitQuantityLabel}</strong><span>Quantidade incluída no ${state.kit.name}. Escolha abaixo se será mix, 2 tipos, 4 tipos ou personalizado.</span></div>`
    : "";

  stepContent.innerHTML = `
    ${kitQuantityNote}
    <div class="choice-grid compact-choice-grid">
      ${[
        ["mix", "Mix", step.itemType === "salgados" ? `Todas as variedades: ${catalog.salgadoSabores}.` : `Variedades disponíveis: ${catalog.doceSabores}.`, "M"],
        ["2", "2 tipos", "Escolha dois sabores e escreva no campo abaixo.", "2"],
        ["4", "4 tipos", "Escolha quatro sabores e escreva no campo abaixo.", "4"],
        ["custom", "Personalizado", "Use o campo livre para anotar exatamente o pedido.", "P"],
      ]
        .map(
          ([mode, title, note, icon]) => `
            <button class="choice-card ${detail.mode === mode ? "selected" : ""}" type="button" data-variety-mode="${mode}">
              <span class="choice-icon">${icon}</span>
              <h3>${title}</h3>
              <p>${note}</p>
              <span class="price-tag">Sem acréscimo</span>
            </button>
          `,
        )
        .join("")}
    </div>
    <label class="field full variety-note ${needsText ? "" : "hidden"}">
      Especificar ${step.itemType}
      <textarea id="variety-text" rows="4" placeholder="Ex: coxinha e kibe / brigadeiro e beijinho">${escapeHtml(detail.text)}</textarea>
    </label>
  `;

  stepContent.querySelectorAll("[data-variety-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state[detailKey].mode = button.dataset.varietyMode;
      if (state[detailKey].mode === "mix") {
        state[detailKey].text = "";
      }
      render();
    });
  });

  const textArea = document.querySelector("#variety-text");
  if (textArea) {
    textArea.addEventListener("input", (event) => {
      state[detailKey].text = event.target.value;
      updateSummary();
    });
  }
}

function renderProductsStep() {
  stepContent.innerHTML = `
    <div class="products-grid">
      ${catalog.outrosProdutos
        .map((product) => {
          const selected = state.outrosProdutos.find((item) => item.id === product.id);
          return `
            <label class="product-card ${selected ? "selected" : ""}">
              <input type="checkbox" value="${product.id}" ${selected ? "checked" : ""}>
              <span>
                <strong>${product.name}</strong>
                <span>${product.note} ${money.format(product.price)}</span>
              </span>
              <input class="product-qty" type="number" min="1" max="99" value="${selected?.quantity || 1}" data-product-qty="${product.id}" ${selected ? "" : "disabled"}>
              ${
                product.options
                  ? `
                    <label class="product-option">
                      ${product.optionsLabel || "Opção"}
                      <select data-product-option="${product.id}" ${selected ? "" : "disabled"}>
                        ${product.options
                          .map(
                            (option) =>
                              `<option value="${option}" ${selected?.option === option ? "selected" : ""}>${option}</option>`,
                          )
                          .join("")}
                      </select>
                    </label>
                  `
                  : ""
              }
              ${
                product.textOptionLabel
                  ? `
                    <label class="product-option">
                      ${product.textOptionLabel}
                      <input type="text" value="${escapeHtml(selected?.option || "")}" placeholder="${product.textOptionPlaceholder || ""}" data-product-text-option="${product.id}" ${selected ? "" : "disabled"}>
                    </label>
                  `
                  : ""
              }
              ${
                product.secondaryOptions
                  ? `
                    <label class="product-option">
                      ${product.secondaryOptionsLabel || "Opção"}
                      <select data-product-secondary-option="${product.id}" ${selected ? "" : "disabled"}>
                        ${product.secondaryOptions
                          .map(
                            (option) =>
                              `<option value="${option}" ${selected?.secondaryOption === option ? "selected" : ""}>${option}</option>`,
                          )
                          .join("")}
                      </select>
                    </label>
                  `
                  : ""
              }
            </label>
          `;
        })
        .join("")}
    </div>
  `;

  stepContent.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener("change", () => {
      const product = catalog.outrosProdutos.find((item) => item.id === input.value);
      const exists = state.outrosProdutos.some((item) => item.id === input.value);

      state.outrosProdutos = exists
        ? state.outrosProdutos.filter((item) => item.id !== input.value)
        : [
            ...state.outrosProdutos,
            {
              ...product,
              quantity: 1,
              option: product.options?.[0] || (product.textOptionLabel ? "0" : ""),
              secondaryOption: product.secondaryOptions?.[0] || "",
            },
          ];

      render();
    });
  });

  stepContent.querySelectorAll("[data-product-qty]").forEach((input) => {
    input.addEventListener("input", () => {
      const quantity = Math.max(1, Number(input.value) || 1);
      state.outrosProdutos = state.outrosProdutos.map((item) =>
        item.id === input.dataset.productQty ? { ...item, quantity } : item,
      );
      updateSummary();
    });
  });

  stepContent.querySelectorAll("[data-product-option]").forEach((select) => {
    select.addEventListener("change", () => {
      state.outrosProdutos = state.outrosProdutos.map((item) =>
        item.id === select.dataset.productOption ? { ...item, option: select.value } : item,
      );
      updateSummary();
    });
  });

  stepContent.querySelectorAll("[data-product-text-option]").forEach((input) => {
    input.addEventListener("input", () => {
      state.outrosProdutos = state.outrosProdutos.map((item) =>
        item.id === input.dataset.productTextOption ? { ...item, option: input.value } : item,
      );
      updateSummary();
    });
  });

  stepContent.querySelectorAll("[data-product-secondary-option]").forEach((select) => {
    select.addEventListener("change", () => {
      state.outrosProdutos = state.outrosProdutos.map((item) =>
        item.id === select.dataset.productSecondaryOption
          ? { ...item, secondaryOption: select.value }
          : item,
      );
      updateSummary();
    });
  });
}

function renderDetailsStep() {
  if (!state.dados.data) {
    state.dados.data = getTomorrow();
  }

  stepContent.innerHTML = `
    <div class="details-grid">
      <label class="field">
        Nome do cliente
        <input id="nome" type="text" value="${escapeHtml(state.dados.nome)}" placeholder="Nome completo">
      </label>
      <label class="field">
        Telefone
        <input id="telefone" type="tel" value="${escapeHtml(state.dados.telefone)}" placeholder="Contacto do cliente">
      </label>
      <label class="field">
        Data do pedido
        <input id="data" type="date" min="${getTomorrow()}" value="${state.dados.data}">
      </label>
      <label class="field">
        Hora
        <input id="hora" type="time" value="${state.dados.hora}">
      </label>
      <label class="field full">
        Observações
        <textarea id="observacoes" rows="5" placeholder="Tema, cores, frase no bolo, detalhes do pedido...">${escapeHtml(state.dados.observacoes)}</textarea>
      </label>
    </div>
  `;

  ["nome", "telefone", "data", "hora", "observacoes"].forEach((id) => {
    document.querySelector(`#${id}`).addEventListener("input", (event) => {
      state.dados[id] = event.target.value;
      updateSummary();
    });
  });
}

function receiptRows() {
  const rows = [["Tipo de orçamento", state.tipo.name]];

  if (["bolo", "acetato"].includes(state.tipo.id)) {
    rows.push(
      ["Massa", state.massa.name],
      ["Recheio", `${state.recheio.name} (${money.format(state.recheio.price)} / kg)`],
      ["Sabor do recheio", state.recheioOpcao.name],
      ["Segundo recheio", formatSecondFilling()],
      ["Peso", `${state.peso.name} - ${state.peso.people} pessoas`],
      ["Valor do bolo", formatCakePriceDetails()],
      ["Fruta extra", state.recheioOpcao.hasFruit ? "Já incluída no recheio" : state.fruta.name],
      ["Decoração", formatDecorationDescription()],
      ["Formato", formatCakeBaseDescription()],
      ["Salgados", formatItems(state.salgados)],
      ...(state.salgados.length ? [["Tipos de salgados", formatVariety(state.salgadosDetalhe, catalog.salgadoSabores)]] : []),
      ["Doces", formatItems(state.doces)],
      ...(state.doces.length ? [["Tipos de doces", formatVariety(state.docesDetalhe, catalog.doceSabores)]] : []),
      ["Outros produtos", formatProducts(state.outrosProdutos)],
    );
  }

  if (state.tipo.id === "kit") {
    rows.push(
      ["Kit festa", `${state.kit.name} (${money.format(state.kit.price)})`],
      ["Massa do kit", state.massa.name],
      ["Recheio do kit", formatKitFillingDescription()],
      ...(state.kitRecheio?.id === "kit-recheio-a-parte" ? [["Acréscimo recheio", money.format(calculateKitFillingExtra())]] : []),
      ["Tipos de salgados", formatVariety(state.salgadosDetalhe, catalog.salgadoSabores, getKitQuantityLabel("salgados"))],
      ["Tipos de doces", formatVariety(state.docesDetalhe, catalog.doceSabores, getKitQuantityLabel("doces"))],
      ["Outros produtos", formatProducts(state.outrosProdutos)],
    );
  }

  if (state.tipo.id === "avulsos") {
    rows.push(
      ["Salgados", formatItems(state.salgados)],
      ...(state.salgados.length ? [["Tipos de salgados", formatVariety(state.salgadosDetalhe, catalog.salgadoSabores)]] : []),
      ["Doces", formatItems(state.doces)],
      ...(state.doces.length ? [["Tipos de doces", formatVariety(state.docesDetalhe, catalog.doceSabores)]] : []),
      ["Outros produtos", formatProducts(state.outrosProdutos)],
    );
  }

  rows.push(["Observações", state.dados.observacoes || "Sem observações"]);

  return rows;
}

function buildReceiptMarkup(copyLabel) {
  const dateInfo = getDateInfo(state.dados.data);

  return `
    <div class="receipt">
      <div class="receipt-copy-label">${copyLabel}</div>
      <div class="receipt-top">
        <div class="receipt-brand-card">
          <img class="receipt-logo" src="assets/logo-cakes-josy-silva-recibo.png" alt="Cakes Josy Silva">
          <p class="receipt-store-info">
            <span>Rua António Feijó, Nº 30</span>
            <span>Loja C, 2725-223</span>
            <span>Algueirão-Mem Martins</span>
            <span>Tel: 210 162 694</span>
          </p>
        </div>
        <div class="receipt-form-header">
          <div class="receipt-form-grid">
            <div class="receipt-field receipt-name">
              <span>Nome:</span>
              <strong>${escapeHtml(state.dados.nome || "")}</strong>
            </div>
            <div class="receipt-field receipt-day">
              <span>Dia:</span>
              <strong>${escapeHtml(dateInfo.weekday)}</strong>
            </div>
            <div class="receipt-field receipt-hour">
              <span>Hrs:</span>
              <strong>${escapeHtml(state.dados.hora || "")}</strong>
            </div>
            <div class="receipt-field receipt-date">
              <span>Data:</span>
              <strong>${escapeHtml(dateInfo.date)}</strong>
            </div>
            <div class="receipt-field receipt-phone">
              <span>Tel:</span>
              <strong>${escapeHtml(state.dados.telefone || "")}</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="receipt-content">
        <div class="receipt-section">
          ${receiptRows()
            .map(
              ([label, value]) => `
                <div class="receipt-row">
                  <span>${escapeHtml(label)}:</span>
                  <strong class="receipt-value">${escapeHtml(value)}</strong>
                </div>
              `,
            )
            .join("")}
        </div>
        <div class="receipt-total">
          <span>Total</span>
          <strong>${money.format(calculateTotal())}</strong>
        </div>
        <div class="receipt-payment">
          <div>
            <span>Pagamento</span>
            <strong>${getPaymentLabel()}</strong>
          </div>
          <div>
            <span>Valor pago</span>
            <strong>${getPaidValue()}</strong>
          </div>
          <div>
            <span>Valor em falta</span>
            <strong>${getRemainingValue()}</strong>
          </div>
        </div>
        <div class="receipt-footer-note">
          <p>Pois, que adianta ao homem ganhar o mundo inteiro e perder a sua alma?</p>
          <strong>Marcos 8:36</strong>
        </div>
      </div>
    </div>
  `;
}

function renderReceipt() {
  printArea.innerHTML = `
    <div class="receipt-sheet">
      ${buildReceiptMarkup("Via da loja")}
      ${buildReceiptMarkup("Via do cliente")}
    </div>
  `;
  printArea.classList.add("visible");
}

function renderPaymentBox() {
  const total = calculateTotal();

  return `
    <div class="payment-box">
      <div class="payment-head">
        <div>
          <span>Total do pedido</span>
          <strong>${money.format(total)}</strong>
        </div>
        <div class="payment-actions">
          <button class="ghost-button ${state.pagamento.percent === 50 ? "active" : ""}" data-payment-percent="50" type="button">50%</button>
          <button class="ghost-button ${state.pagamento.percent === 100 ? "active" : ""}" data-payment-percent="100" type="button">100%</button>
          <button class="ghost-button ${state.pagamento.status === "awaiting" ? "active" : ""}" data-payment-status="awaiting" type="button">Aguarda pagamento</button>
        </div>
      </div>
      <div class="payment-grid">
        <div>
          <span>Valor a pagar</span>
          <strong>${getPaidValue()}</strong>
        </div>
        <div>
          <span>Valor em falta</span>
          <strong>${getRemainingValue()}</strong>
        </div>
      </div>
    </div>
  `;
}

function renderFinalStep() {
  renderReceipt();
  stepContent.innerHTML = `
    <div class="final-actions">
      <button class="whatsapp-button" id="whatsapp-button" type="button">Abrir no WhatsApp</button>
      <button class="ghost-button copy-button" id="copy-order-button" type="button">Copiar mensagem</button>
      <button class="print-button" id="print-button" type="button">Imprimir pedido</button>
      <button class="ghost-button" id="edit-button" type="button">Editar dados</button>
    </div>
    <p class="final-share-note">
      O botao do WhatsApp abre a mensagem do pedido ja pronta para escolher a conversa e enviar.
    </p>
    ${renderPaymentBox()}
    <p class="summary-line">
      Ok, já estamos sentindo o cheirinho de bolo no forno. O seu pedido está quase pronto.
    </p>
  `;
  document.querySelectorAll("[data-payment-percent]").forEach((button) => {
    button.addEventListener("click", () => {
      const percent = Number(button.dataset.paymentPercent);
      state.pagamento.percent = state.pagamento.percent === percent ? 0 : percent;
      state.pagamento.status = state.pagamento.percent ? "percent" : "blank";
      render();
    });
  });
  document.querySelectorAll("[data-payment-status]").forEach((button) => {
    button.addEventListener("click", () => {
      state.pagamento.status = state.pagamento.status === button.dataset.paymentStatus ? "blank" : button.dataset.paymentStatus;
      state.pagamento.percent = 0;
      render();
    });
  });
  document.querySelector("#whatsapp-button").addEventListener("click", () => {
    openOrderInWhatsApp();
  });
  document.querySelector("#copy-order-button").addEventListener("click", async () => {
    await copyOrderMessage();
  });
  document.querySelector("#print-button").addEventListener("click", () => {
    saveHistoryEntry();
    clearDraft();
    window.print();
  });
  document.querySelector("#edit-button").addEventListener("click", () => {
    currentStep = getActiveSteps().findIndex((step) => step.key === "dados");
    render();
  });
}

function updateSummary() {
  const rows = [["Tipo", state.tipo.name]];

  if (["bolo", "acetato"].includes(state.tipo.id)) {
    rows.push(
      ["Massa", state.massa.name],
      ["Recheio", `${state.recheio.name} - ${money.format(state.recheio.price)} / kg`],
      ["Sabor", state.recheioOpcao.name],
      ["Segundo recheio", formatSecondFilling()],
      ["Peso", `${state.peso.name} - ${state.peso.people} pessoas`],
      ["Valor do bolo", formatCakePriceDetails()],
      ["Fruta extra", state.recheioOpcao.hasFruit ? "Já incluída no recheio" : state.fruta.name],
      ["Decoração", formatDecorationDescription()],
      ["Formato", formatCakeBaseDescription()],
      ["Salgados", formatItems(state.salgados)],
      ...(state.salgados.length ? [["Tipos de salgados", formatVariety(state.salgadosDetalhe, catalog.salgadoSabores)]] : []),
      ["Doces", formatItems(state.doces)],
      ...(state.doces.length ? [["Tipos de doces", formatVariety(state.docesDetalhe, catalog.doceSabores)]] : []),
      ["Outros produtos", formatProducts(state.outrosProdutos)],
    );
  }

  if (state.tipo.id === "kit") {
    rows.push(
      ["Kit festa", state.kit.name],
      ["Massa do kit", state.massa.name],
      ["Recheio do kit", formatKitFillingDescription()],
      ...(state.kitRecheio?.id === "kit-recheio-a-parte" ? [["Acréscimo recheio", money.format(calculateKitFillingExtra())]] : []),
      ["Tipos de salgados", formatVariety(state.salgadosDetalhe, catalog.salgadoSabores, getKitQuantityLabel("salgados"))],
      ["Tipos de doces", formatVariety(state.docesDetalhe, catalog.doceSabores, getKitQuantityLabel("doces"))],
      ["Outros produtos", formatProducts(state.outrosProdutos)],
    );
  }

  if (state.tipo.id === "avulsos") {
    rows.push(
      ["Salgados", formatItems(state.salgados)],
      ...(state.salgados.length ? [["Tipos de salgados", formatVariety(state.salgadosDetalhe, catalog.salgadoSabores)]] : []),
      ["Doces", formatItems(state.doces)],
      ...(state.doces.length ? [["Tipos de doces", formatVariety(state.docesDetalhe, catalog.doceSabores)]] : []),
      ["Outros produtos", formatProducts(state.outrosProdutos)],
    );
  }

  liveSummary.innerHTML = rows
    .map(
      ([label, value]) => `
        <div class="summary-line">
          <span>${label}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `,
    )
    .join("");

  liveTotal.textContent = money.format(calculateTotal());

  if (currentStep === getActiveSteps().length - 1) {
    renderReceipt();
  }

  saveDraft();
}

function validateStep() {
  const step = getActiveSteps()[currentStep];

  if (step.type === "variety") {
    const detail = state[`${step.itemType}Detalhe`];
    if (detail.mode !== "mix" && !detail.text.trim()) {
      alert(`Especifique os tipos de ${step.itemType} antes de continuar.`);
      return false;
    }
    return true;
  }

  if (step.type !== "details") {
    return true;
  }

  if (!state.dados.nome.trim() || !state.dados.telefone.trim() || !state.dados.data || !state.dados.hora) {
    alert("Preencha nome, telefone, data e hora para finalizar o pedido.");
    return false;
  }

  if (isSunday(state.dados.data)) {
    alert("A loja está fechada aos domingos. Sugira retirada no sábado ao final do dia.");
    return false;
  }

  return true;
}

function render() {
  const activeSteps = getActiveSteps();
  currentStep = Math.min(currentStep, activeSteps.length - 1);
  const step = activeSteps[currentStep];
  const progress = ((currentStep + 1) / activeSteps.length) * 100;

  stepTitle.textContent = getCurrentStepTitle(step);
  stepDescription.textContent = getCurrentStepDescription(step);
  progressFill.style.width = `${progress}%`;
  progressLabel.textContent = `Passo ${currentStep + 1} de ${activeSteps.length}`;
  backButton.disabled = currentStep === 0;
  nextButton.textContent = currentStep === activeSteps.length - 1 ? "Concluir" : "Seguinte";

  if (step.type === "single") {
    renderChoiceStep(step);
  }

  if (step.type === "multi") {
    renderMultiStep(step);
  }

  if (step.type === "variety") {
    renderVarietyStep(step);
  }

  if (step.type === "products") {
    renderProductsStep();
  }

  if (step.type === "details") {
    renderDetailsStep();
  }

  if (step.type === "final") {
    renderFinalStep();
  } else {
    printArea.classList.remove("visible");
  }

  updateSummary();
}

function resetOrder({ clearSavedDraft = false } = {}) {
  if (clearSavedDraft) {
    clearDraft();
  }

  state.tipo = catalog.tipos[0];
  state.massa = catalog.massas[0];
  state.recheio = catalog.recheios[0];
  state.recheioOpcao = catalog.recheiosEspecificos[0];
  state.segundoRecheio = null;
  state.peso = catalog.pesos[0];
  state.fruta = catalog.frutas[0];
  state.decoracao = catalog.decoracoes[0];
  state.formato = catalog.formatos[0];
  state.kit = catalog.kits[0];
  state.kitTipoBolo = catalog.kitTiposBolo[0];
  state.kitRecheio = catalog.recheiosEspecificos.find((option) => option.id === "doce-leite");
  state.salgados = [];
  state.salgadosDetalhe = {
    mode: "mix",
    text: "",
  };
  state.doces = [];
  state.docesDetalhe = {
    mode: "mix",
    text: "",
  };
  state.outrosProdutos = [];
  state.dados = {
    nome: "",
    telefone: "",
    data: getTomorrow(),
    hora: "15:00",
    observacoes: "",
  };
  state.pagamento = {
    percent: 0,
    status: "blank",
  };
  currentReceiptCode = getNextReceiptCode();
  currentStep = 0;
  render();
}

backButton.addEventListener("click", () => {
  currentStep = Math.max(0, currentStep - 1);
  render();
});

nextButton.addEventListener("click", () => {
  if (!validateStep()) {
    return;
  }

  if (currentStep < getActiveSteps().length - 1) {
    currentStep += 1;
    render();
  }
});

if (resumeOrderButton) {
  resumeOrderButton.addEventListener("click", () => loadDraft());
}

if (historyButton) {
  historyButton.addEventListener("click", showHistory);
}

if (resetOrdersButton) {
  resetOrdersButton.addEventListener("click", () => {
    if (!confirm("Isto vai apagar o historico/rascunho e voltar para Pedido #0001. Continuar?")) {
      return;
    }

    if (resetStoredOrders()) {
      resetOrder();
      alert("Pedidos reiniciados. Proximo pedido: #0001.");
    }
  });
}

newOrderButton.addEventListener("click", () => {
  const hasDraft = Boolean(getStoredJson(STORAGE_KEYS.draft, null));
  if (!hasDraft || confirm("Começar um novo pedido e apagar o rascunho atual?")) {
    resetOrder({ clearSavedDraft: true });
  }
});

if (!loadDraft({ silent: true })) {
  resetOrder();
}
persistenceReady = true;
saveDraft();
updateStorageButtons();
