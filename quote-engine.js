const money = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

const settings = {
  minimumLeadDays: 3,
  businessHours: "segunda a sabado, das 10:00 as 18:00",
};

const catalog = {
  types: [
    { id: "bolo", name: "Bolo decorado" },
    { id: "acetato", name: "Bolo no acetato" },
    { id: "kit", name: "Kit festa" },
    { id: "avulsos", name: "Doces e salgados" },
  ],
  masses: [
    { id: "chocolate", name: "Chocolate" },
    { id: "branca", name: "Massa branca" },
    { id: "baunilha", name: "Baunilha" },
    { id: "red-velvet", name: "Red velvet" },
    { id: "cenoura", name: "Cenoura" },
    { id: "mista", name: "Massa mista" },
  ],
  fillingCategories: [
    { id: "tradicional", name: "Tradicional", price: 20 },
    { id: "especial", name: "Especial", price: 22 },
    { id: "gourmet", name: "Gourmet", price: 24 },
  ],
  fillings: [
    { id: "brigadeiro-leite", category: "tradicional", name: "Brigadeiro ao leite" },
    { id: "brigadeiro-branco", category: "tradicional", name: "Brigadeiro branco" },
    { id: "prestigio", category: "tradicional", name: "Prestigio" },
    { id: "ananas-cremoso", category: "tradicional", name: "Ananas cremoso", hasFruit: true },
    { id: "doce-leite", category: "tradicional", name: "Doce de leite cremoso" },
    { id: "doce-leite-coco", category: "tradicional", name: "Doce de leite com coco" },
    { id: "casadinho", category: "tradicional", name: "Casadinho" },
    { id: "dois-amores", category: "tradicional", name: "Dois amores" },
    { id: "chantilly", category: "tradicional", name: "Chantilly" },
    { id: "leite-nido", category: "especial", name: "Leite Nido" },
    { id: "nozes", category: "especial", name: "Brigadeiro de Nozes" },
    { id: "cream-cheese-brigadeiro", category: "especial", name: "Brigadeiro de Cream Cheese" },
    { id: "amendoim", category: "especial", name: "Brigadeiro de Amendoim" },
    { id: "maracuja", category: "gourmet", name: "Brigadeiro de Maracuja" },
    { id: "nido-morangos", category: "gourmet", name: "Leite Nido com morangos", hasFruit: true },
    { id: "cream-cheese", category: "gourmet", name: "Cream Cheese" },
    { id: "nutella", category: "gourmet", name: "Nutella" },
    { id: "ferrero", category: "gourmet", name: "Ferrero Rocher" },
    { id: "kinder", category: "gourmet", name: "Kinder Bueno" },
    { id: "oreo", category: "gourmet", name: "Oreo" },
    { id: "pistachio", category: "gourmet", name: "Pistachio e brigadeiro" },
  ],
  weights: [
    { id: "1-2kg", name: "1,2 kg", kg: 1.2, people: 7 },
    { id: "1-5kg", name: "1,5 kg", kg: 1.5, people: 10 },
    { id: "2kg", name: "2,0 kg", kg: 2, people: 15 },
    { id: "2-5kg", name: "2,5 kg", kg: 2.5, people: 20 },
    { id: "3kg", name: "3,0 kg", kg: 3, people: 25 },
    { id: "3-5kg", name: "3,5 kg", kg: 3.5, people: 30 },
    { id: "4kg", name: "4,0 kg", kg: 4, people: 40 },
    { id: "5kg", name: "5,0 kg", kg: 5, people: 50 },
    { id: "6kg", name: "6,0 kg", kg: 6, people: 60 },
  ],
  decorations: [
    { id: "sem", name: "Sem decoracao extra", price: 0 },
    { id: "duas-cores", name: "Duas cores chantilly", price: 2 },
    { id: "duas-cores-nome", name: "Duas cores chantilly + nome", price: 5 },
    { id: "decorado", name: "Decoracao personalizada", price: 10 },
  ],
  formats: [
    { id: "retangular", name: "Formato retangular", price: 0 },
    { id: "redondo", name: "Formato redondo", price: 0 },
    { id: "coracao", name: "Formato coracao", price: 0 },
  ],
  fruits: [
    { id: "sem-fruta", name: "Sem fruta extra", price: 0 },
    { id: "morango", name: "Morango extra", price: 1 },
    { id: "ananas", name: "Ananas extra", price: 1 },
    { id: "frutos-vermelhos", name: "Frutos vermelhos", price: 1 },
  ],
  kits: [
    { id: "kit-6", name: "Kit 6 pessoas - acetato", price: 68, boloKg: 1, doces: 25, salgados: 50 },
    { id: "kit-6-decorado", name: "Kit 6 pessoas - com decoracao", price: 78, boloKg: 1, doces: 25, salgados: 50 },
    { id: "kit-10", name: "Kit 10 pessoas - acetato", price: 80, boloKg: 1.5, doces: 30, salgados: 80 },
    { id: "kit-10-decorado", name: "Kit 10 pessoas - com decoracao", price: 90, boloKg: 1.5, doces: 30, salgados: 80 },
    { id: "kit-20", name: "Kit 15-20 pessoas - acetato", price: 115, boloKg: 2, doces: 40, salgados: 120 },
    { id: "kit-20-decorado", name: "Kit 15-20 pessoas - com decoracao", price: 125, boloKg: 2, doces: 40, salgados: 120 },
    { id: "kit-30", name: "Kit 25-30 pessoas - acetato", price: 175, boloKg: 3, doces: 50, salgados: 200 },
    { id: "kit-30-decorado", name: "Kit 25-30 pessoas - com decoracao", price: 185, boloKg: 3, doces: 50, salgados: 200 },
  ],
  kitIncludedFillings: ["doce-leite", "brigadeiro-leite", "ananas-cremoso", "prestigio"],
  savories: [
    { id: "salgados-25", name: "Mini salgados - 25 un", price: 18 },
    { id: "salgados-50", name: "Mini salgados - 50 un", price: 28 },
    { id: "salgados-100", name: "Mini salgados - 100 un/personalizado", customLabel: "Mini salgados", price: 45, unitPrice: 0.45, defaultQuantity: 100, customQuantity: true },
    { id: "empadas-12", name: "Mini empadas - 12 un", price: 14 },
    { id: "empadas-20", name: "Mini empadas - 20 un", price: 23 },
    { id: "empadas-40", name: "Mini empadas - 40 un", price: 40 },
  ],
  sweets: [
    { id: "tradicionais-20", name: "Doces tradicionais - 20 un", price: 18 },
    { id: "tradicionais-50", name: "Doces tradicionais - 50 un", price: 30 },
    { id: "tradicionais-100", name: "Doces tradicionais - 100 un", price: 49 },
    { id: "gourmet-20", name: "Doces especiais - 20 un", price: 25 },
    { id: "gourmet-50", name: "Doces especiais - 50 un", price: 45 },
  ],
  products: [
    { id: "mini-bolo", name: "Mini bolo", price: 9.5, needsFlavor: true },
    { id: "pao-mel", name: "Pao de mel", price: 4 },
    { id: "tarte", name: "Tarte", price: 3.8 },
    { id: "empada-grande", name: "Empada grande", price: 2.5 },
    { id: "coxinha-grande", name: "Coxinha grande", price: 2.5 },
    { id: "pao-misto", name: "Pao com misto", price: 2.5 },
    { id: "brigadeiro-uva", name: "Brigadeiro de uva", price: 4.5 },
    { id: "brigadeiro-morango", name: "Brigadeiro de morango", price: 4.5 },
    { id: "trufa", name: "Trufas recheadas", price: 2.5, needsFlavor: true },
    { id: "cone", name: "Cone trufado", price: 3.8, needsFlavor: true },
    { id: "carolina", name: "Carolina", price: 1.5 },
    { id: "bolo-pote", name: "Bolo de pote", price: 4, needsFlavor: true },
    { id: "copo-pudim", name: "Copo de pudim", price: 5 },
    { id: "bolo-gelado", name: "Bolo gelado", price: 4, needsFlavor: true },
    { id: "bolo-pudim-fatia", name: "Bolo pudim - fatia", price: 5 },
    { id: "fatia-bolo", name: "Fatia de bolo", price: 6, requiresAvailabilityConfirmation: true },
    { id: "topo-parabens", name: "Topo parabens", price: 3.5 },
    { id: "topo-aniversario", name: "Topo aniversario", price: 4 },
    { id: "topo-variedades", name: "Topo outras variedades", price: 4 },
    { id: "vela-numero", name: "Vela numero", price: 1.5, needsNumber: true, secondaryOptions: ["Ouro", "Prata"] },
    { id: "vela-foguete", name: "Vela foguete", price: 3.5 },
    { id: "vela-lisa", name: "Vela lisa simples", price: 1 },
  ],
  savoryFlavorMix: "coxinha, rissoles fiambre/queijo, kibe, croquete carne, bolinha de queijo",
  sweetFlavorMix: "brigadeiro, beijinho e variedades disponiveis da loja",
};

const aliases = {
  types: {
    bolo: ["bolo decorado", "bolo", "aniversario", "aniversário"],
    acetato: ["bolo no acetato", "acetato"],
    kit: ["kit festa", "kit", "kit festas"],
    avulsos: ["avulsos", "doces e salgados", "doces", "salgados"],
  },
  decorations: {
    sem: ["sem decoracao", "sem decoração", "sem topper", "sem extra"],
    "duas-cores": ["duas cores", "2 cores"],
    "duas-cores-nome": ["duas cores com nome", "duas cores + nome", "2 cores com nome"],
    decorado: ["decoracao personalizada", "decoração personalizada", "topo", "drip", "flores", "papel fotografico", "papel fotografico", "decorado"],
  },
  formats: {
    retangular: ["retangular", "quadrado"],
    redondo: ["redondo", "circular"],
    coracao: ["coracao", "coração", "coraçao"],
  },
  fruits: {
    "sem-fruta": ["sem fruta", "nao", "não"],
    morango: ["morango", "morangos"],
    ananas: ["ananas", "ananas extra", "ananás", "ananás extra"],
    "frutos-vermelhos": ["frutos vermelhos", "frutos"],
  },
};

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s/+.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number.parseFloat(String(value).replace(",", ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrency(value) {
  return money.format(Number(value || 0));
}

function getByIdOrName(list, value, extraAliases = {}) {
  if (!value) {
    return null;
  }

  const normalizedValue = normalizeText(value);
  const aliasEntries = Object.entries(extraAliases);

  return (
    list.find((item) => normalizeText(item.id) === normalizedValue || normalizeText(item.name) === normalizedValue) ||
    list.find((item) =>
      aliasEntries.some(([id, names]) => id === item.id && names.some((alias) => normalizeText(alias) === normalizedValue)),
    ) ||
    list.find((item) => normalizedValue.includes(normalizeText(item.name)) || normalizeText(item.name).includes(normalizedValue))
  );
}

function getType(value) {
  return getByIdOrName(catalog.types, value, aliases.types) || catalog.types.find((item) => item.id === "bolo");
}

function getMass(value) {
  return getByIdOrName(catalog.masses, value);
}

function getDecoration(value) {
  return getByIdOrName(catalog.decorations, value, aliases.decorations);
}

function getFormat(value) {
  return getByIdOrName(catalog.formats, value, aliases.formats);
}

function getFruit(value) {
  return getByIdOrName(catalog.fruits, value, aliases.fruits);
}

function getFillingCategory(value) {
  return getByIdOrName(catalog.fillingCategories, value);
}

function getFillingOption(value, categoryId) {
  const option = getByIdOrName(
    categoryId ? catalog.fillings.filter((item) => item.category === categoryId) : catalog.fillings,
    value,
  );

  return option || null;
}

function getKit(value) {
  return getByIdOrName(catalog.kits, value);
}

function getSavory(value) {
  return getByIdOrName(catalog.savories, value);
}

function getSweet(value) {
  return getByIdOrName(catalog.sweets, value);
}

function getProduct(value) {
  return getByIdOrName(catalog.products, value);
}

function getWeightByKg(value) {
  const parsed = parseNumber(value);
  if (parsed === null) {
    return null;
  }

  return catalog.weights.find((item) => item.kg === parsed) || null;
}

function inferWeightByPeople(value) {
  const parsed = parseNumber(value);
  if (parsed === null) {
    return null;
  }

  return catalog.weights.find((item) => item.people >= parsed) || catalog.weights[catalog.weights.length - 1];
}

function getFillingPriceByCategory(categoryId) {
  return catalog.fillingCategories.find((item) => item.id === categoryId)?.price || catalog.fillingCategories[0].price;
}

function hasMinimumLeadDays(dateValue, now = new Date()) {
  if (!dateValue) {
    return null;
  }

  const [year, month, day] = String(dateValue).split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  const requested = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = requested.getTime() - today.getTime();
  return Math.floor(diff / 86400000);
}

function isSunday(dateValue) {
  if (!dateValue) {
    return false;
  }

  const [year, month, day] = String(dateValue).split("-").map(Number);
  return new Date(year, month - 1, day).getDay() === 0;
}

function getDateInfo(dateValue) {
  if (!dateValue) {
    return { weekday: "", date: "" };
  }

  const [year, month, day] = String(dateValue).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = new Intl.DateTimeFormat("pt-PT", { weekday: "long" }).format(date);

  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    date: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`,
  };
}

function normalizeSavorySelection(item) {
  const savory = getSavory(item.id || item.name || item.type || item);
  if (!savory) {
    return null;
  }

  if (!savory.customQuantity) {
    return { ...savory, quantity: 1, total: savory.price };
  }

  const quantity = Math.max(1, parseNumber(item.quantity) || savory.defaultQuantity || 100);
  return {
    ...savory,
    quantity,
    total: quantity * savory.unitPrice,
  };
}

function normalizeSweetSelection(item) {
  const sweet = getSweet(item.id || item.name || item.type || item);
  if (!sweet) {
    return null;
  }

  return { ...sweet, quantity: 1, total: sweet.price };
}

function normalizeProductSelection(item) {
  const product = getProduct(item.id || item.name || item.type || item);
  if (!product) {
    return null;
  }

  const quantity = Math.max(1, parseNumber(item.quantity) || 1);
  return {
    ...product,
    quantity,
    option: item.option || item.flavor || item.sabor || "",
    secondaryOption: item.secondaryOption || item.cor || "",
    total: product.price * quantity,
  };
}

function normalizeInput(input = {}) {
  const type = getType(input.type || input.tipo);
  const people = parseNumber(input.people || input.pessoas);
  const explicitWeight = getWeightByKg(input.weightKg || input.weight || input.peso);
  const inferredWeight = explicitWeight || inferWeightByPeople(people);
  const fillingCategory = getFillingCategory(input.fillingCategory || input.recheioCategoria || input.recheio);
  const fillingOption = getFillingOption(
    input.fillingFlavor || input.fillingOption || input.recheioSabor || input.recheioOpcao,
    fillingCategory?.id,
  );
  const secondFillingOption = getFillingOption(
    input.secondFillingFlavor || input.segundoRecheioSabor || input.secondFilling || input.segundoRecheio,
  );
  const normalizedSavories = Array.isArray(input.savories || input.salgados)
    ? (input.savories || input.salgados).map(normalizeSavorySelection).filter(Boolean)
    : [];
  const normalizedSweets = Array.isArray(input.sweets || input.doces)
    ? (input.sweets || input.doces).map(normalizeSweetSelection).filter(Boolean)
    : [];
  const normalizedProducts = Array.isArray(input.products || input.outrosProdutos)
    ? (input.products || input.outrosProdutos).map(normalizeProductSelection).filter(Boolean)
    : [];
  const kit = getKit(input.kit || input.kitId);
  const kitFillingOption = getFillingOption(
    input.kitFillingFlavor || input.kitRecheioSabor || input.fillingFlavor || input.recheioSabor,
  );

  return {
    type: type.id,
    typeName: type.name,
    date: input.date || input.data || "",
    time: input.time || input.hora || "",
    customerName: input.customerName || input.nome || "",
    customerPhone: input.customerPhone || input.telefone || "",
    notes: input.notes || input.observacoes || input.tema || "",
    people,
    weight: inferredWeight,
    mass: getMass(input.mass || input.massa),
    fillingCategory,
    fillingOption,
    secondFillingOption,
    fruit: getFruit(input.fruit || input.fruta),
    decoration: getDecoration(input.decoration || input.decoracao),
    format: getFormat(input.format || input.formato),
    kit,
    kitFillingMode: normalizeText(input.kitFillingMode || input.kitRecheioMode || input.kitRecheio || ""),
    kitFillingOption,
    savories: normalizedSavories,
    savoryVarietyMode: input.savoryVarietyMode || input.salgadosModo || "mix",
    savoryVarietyText: input.savoryVarietyText || input.salgadosDetalhe || "",
    sweets: normalizedSweets,
    sweetVarietyMode: input.sweetVarietyMode || input.docesModo || "mix",
    sweetVarietyText: input.sweetVarietyText || input.docesDetalhe || "",
    products: normalizedProducts,
  };
}

function getMissingFields(request) {
  const missing = [];

  if (!request.date) {
    missing.push("data pretendida");
  }

  if (["bolo", "acetato"].includes(request.type)) {
    if (!request.weight && !request.people) {
      missing.push("numero de pessoas ou peso");
    }
    if (!request.mass) {
      missing.push("massa");
    }
    if (!request.fillingCategory) {
      missing.push("categoria do recheio");
    }
    if (!request.fillingOption) {
      missing.push("sabor do recheio");
    }
    if (!request.fruit && !request.fillingOption?.hasFruit) {
      missing.push("fruta extra ou sem fruta");
    }
    if (!request.decoration) {
      missing.push("tipo de decoracao");
    }
    if (!request.format) {
      missing.push("formato");
    }
  }

  if (request.type === "kit") {
    if (!request.kit) {
      missing.push("kit festa pretendido");
    }
    if (!request.mass) {
      missing.push("massa do bolo do kit");
    }
    if (!request.kitFillingMode) {
      missing.push("recheio do kit");
    }
    if (request.kitFillingMode.includes("parte") && !request.kitFillingOption) {
      missing.push("sabor do recheio a parte");
    }
  }

  if (request.type === "avulsos" && !request.savories.length && !request.sweets.length && !request.products.length) {
    missing.push("produto ou quantidade");
  }

  return missing;
}

function calculateCakeBase(request) {
  const weightKg = request.weight?.kg || 0;
  if (!weightKg || !request.fillingCategory) {
    return 0;
  }

  const firstPrice = request.fillingCategory.price;

  if (!request.secondFillingOption || weightKg < 1.5) {
    return calculateHeartCakeBase(request, firstPrice, null);
  }

  const secondPrice = getFillingPriceByCategory(request.secondFillingOption.category);
  return calculateHeartCakeBase(request, firstPrice, secondPrice);
}

function calculateHeartCakeBase(request, firstPrice, secondPrice) {
  const weightKg = request.weight?.kg || 0;
  const isHeart = request.format?.id === "coracao";
  const heartBasePrices = { 1.5: 50, 2: 60, 3: 80 };

  if (!isHeart) {
    if (!secondPrice) {
      return firstPrice * weightKg;
    }
    return firstPrice * (weightKg / 2) + secondPrice * (weightKg / 2);
  }

  const basePrice = heartBasePrices[weightKg];
  const traditionalPrice = catalog.fillingCategories[0].price;

  if (!basePrice) {
    if (!secondPrice) {
      return firstPrice * weightKg;
    }
    return firstPrice * (weightKg / 2) + secondPrice * (weightKg / 2);
  }

  if (!secondPrice) {
    return basePrice + (firstPrice - traditionalPrice) * weightKg;
  }

  const half = weightKg / 2;
  return basePrice + (firstPrice - traditionalPrice) * half + (secondPrice - traditionalPrice) * half;
}

function calculateFruitTotal(request) {
  if (!request.weight || !request.fruit || request.fillingOption?.hasFruit) {
    return 0;
  }

  return request.fruit.price * request.weight.kg;
}

function calculateDecorationTotal(request) {
  if (!request.decoration) {
    return 0;
  }

  return request.format?.id === "coracao" ? 0 : request.decoration.price;
}

function calculateKitExtra(request) {
  if (request.type !== "kit" || !request.kit) {
    return 0;
  }

  if (!request.kitFillingMode.includes("parte") || !request.kitFillingOption) {
    return 0;
  }

  const basePrice = catalog.fillingCategories[0].price;
  const categoryPrice = getFillingPriceByCategory(request.kitFillingOption.category);
  return Math.max(0, categoryPrice - basePrice) * request.kit.boloKg;
}

function calculateTotal(request) {
  const cakeTotal = ["bolo", "acetato"].includes(request.type)
    ? calculateCakeBase(request) + calculateFruitTotal(request) + calculateDecorationTotal(request)
    : 0;
  const kitTotal = request.type === "kit" ? (request.kit?.price || 0) + calculateKitExtra(request) : 0;
  const savoryTotal = request.savories.reduce((sum, item) => sum + item.total, 0);
  const sweetTotal = request.sweets.reduce((sum, item) => sum + item.total, 0);
  const productTotal = request.products.reduce((sum, item) => sum + item.total, 0);

  return cakeTotal + kitTotal + savoryTotal + sweetTotal + productTotal;
}

function formatItemList(items) {
  if (!items.length) {
    return "Nao incluido";
  }

  return items
    .map((item) => {
      if (item.customQuantity) {
        return `${item.customLabel || item.name} - ${item.quantity} un (${formatCurrency(item.total)})`;
      }
      return `${item.name} (${formatCurrency(item.total)})`;
    })
    .join(", ");
}

function formatVariety(mode, text, fallback, quantityLabel = "") {
  const prefix = quantityLabel ? `${quantityLabel} - ` : "";
  if (mode === "mix" || !mode) {
    return `${prefix}Mix (${fallback})`;
  }
  if (mode === "2") {
    return `${prefix}2 tipos: ${text || "por preencher"}`;
  }
  if (mode === "4") {
    return `${prefix}4 tipos: ${text || "por preencher"}`;
  }
  return `${prefix}${text || "Personalizado por preencher"}`;
}

function formatProducts(items) {
  if (!items.length) {
    return "Nao incluido";
  }

  return items
    .map((item) => {
      const details = [item.option, item.secondaryOption].filter(Boolean).join(" - ");
      return `${item.quantity}x ${item.name}${details ? ` - ${details}` : ""} (${formatCurrency(item.total)})`;
    })
    .join(", ");
}

function buildSummaryRows(request) {
  const rows = [["Tipo de orcamento", request.typeName]];

  if (["bolo", "acetato"].includes(request.type)) {
    const weightLabel = request.weight ? `${request.weight.name} - ${request.weight.people} pessoas` : "Por confirmar";
    const base = calculateCakeBase(request);
    const fruit = calculateFruitTotal(request);
    const decoration = calculateDecorationTotal(request);
    const cakeTotal = base + fruit + decoration;
    const components = [`base ${formatCurrency(base)}`];

    if (fruit) {
      components.push(`fruta ${formatCurrency(fruit)}`);
    }
    if (decoration) {
      components.push(`decoracao ${formatCurrency(decoration)}`);
    }

    rows.push(
      ["Massa", request.mass?.name || "Por confirmar"],
      ["Recheio", request.fillingCategory ? `${request.fillingCategory.name} (${formatCurrency(request.fillingCategory.price)} / kg)` : "Por confirmar"],
      ["Sabor do recheio", request.fillingOption?.name || "Por confirmar"],
      ["Segundo recheio", request.secondFillingOption ? `${request.secondFillingOption.name} (${catalog.fillingCategories.find((item) => item.id === request.secondFillingOption.category)?.name || ""})` : "Nao contem"],
      ["Peso", weightLabel],
      ["Valor do bolo", `${formatCurrency(cakeTotal)} (${components.join(" + ")})`],
      ["Fruta extra", request.fillingOption?.hasFruit ? "Ja incluida no recheio" : request.fruit?.name || "Por confirmar"],
      ["Decoracao", request.format?.id === "coracao" ? `${request.decoration?.name || "Por confirmar"} (sem efeito na tabela coracao)` : request.decoration?.name || "Por confirmar"],
      ["Formato", request.format?.id === "coracao" ? "Tabela coracao aplicada" : request.format?.name || "Por confirmar"],
      ["Salgados", formatItemList(request.savories)],
      ...(request.savories.length ? [["Tipos de salgados", formatVariety(request.savoryVarietyMode, request.savoryVarietyText, catalog.savoryFlavorMix)]] : []),
      ["Doces", formatItemList(request.sweets)],
      ...(request.sweets.length ? [["Tipos de doces", formatVariety(request.sweetVarietyMode, request.sweetVarietyText, catalog.sweetFlavorMix)]] : []),
      ["Outros produtos", formatProducts(request.products)],
    );
  }

  if (request.type === "kit") {
    const fillingDescription = request.kitFillingMode.includes("parte")
      ? `${request.kitFillingOption?.name || "Por confirmar"} - ${catalog.fillingCategories.find((item) => item.id === request.kitFillingOption?.category)?.name || "A parte"}`
      : `${request.kitFillingOption?.name || "Recheio incluido"} (incluido)`;
    rows.push(
      ["Kit festa", request.kit ? `${request.kit.name} (${formatCurrency(request.kit.price)})` : "Por confirmar"],
      ["Massa do kit", request.mass?.name || "Por confirmar"],
      ["Recheio do kit", fillingDescription],
      ...(request.kitFillingMode.includes("parte") ? [["Acrescimo recheio", formatCurrency(calculateKitExtra(request))]] : []),
      ["Tipos de salgados", formatVariety(request.savoryVarietyMode, request.savoryVarietyText, catalog.savoryFlavorMix, request.kit ? `${request.kit.salgados} salgados` : "")],
      ["Tipos de doces", formatVariety(request.sweetVarietyMode, request.sweetVarietyText, catalog.sweetFlavorMix, request.kit ? `${request.kit.doces} doces` : "")],
      ["Outros produtos", formatProducts(request.products)],
    );
  }

  if (request.type === "avulsos") {
    rows.push(
      ["Salgados", formatItemList(request.savories)],
      ...(request.savories.length ? [["Tipos de salgados", formatVariety(request.savoryVarietyMode, request.savoryVarietyText, catalog.savoryFlavorMix)]] : []),
      ["Doces", formatItemList(request.sweets)],
      ...(request.sweets.length ? [["Tipos de doces", formatVariety(request.sweetVarietyMode, request.sweetVarietyText, catalog.sweetFlavorMix)]] : []),
      ["Outros produtos", formatProducts(request.products)],
    );
  }

  rows.push(["Observacoes", request.notes || "Sem observacoes"]);
  return rows;
}

function evaluateTiming(request, now = new Date()) {
  const leadDays = hasMinimumLeadDays(request.date, now);
  return {
    leadDays,
    isSunday: isSunday(request.date),
    needsHumanConfirmation: true,
    confirmationAllowed: leadDays !== null ? leadDays >= settings.minimumLeadDays && !isSunday(request.date) : null,
  };
}

function buildMissingMessage(missingFields) {
  return [
    "Para calcular o seu orcamento com mais precisao, so preciso confirmar:",
    "",
    ...missingFields.map((field) => `- ${field}`),
  ].join("\n");
}

function buildQuoteMessage(result) {
  const dateInfo = getDateInfo(result.request.date);
  const detailLines = result.summaryRows
    .filter(([label]) => !["Tipo de orcamento", "Observacoes"].includes(label))
    .map(([label, value]) => `- ${label}: ${value}`);
  const importantLines = [
    "- Este valor e um orcamento estimado com base nas informacoes recebidas",
    "- A confirmacao final e sempre feita por um atendente humano",
    `- Pedidos e confirmacoes exigem no minimo ${settings.minimumLeadDays} dias de antecedencia`,
    `- O atendimento da loja e de ${settings.businessHours}`,
  ];

  if (result.timing.isSunday) {
    importantLines.push("- A loja nao abre aos domingos e nao faz retiradas aos domingos");
  } else if (result.timing.leadDays !== null && result.timing.leadDays < settings.minimumLeadDays) {
    importantLines.push(`- Para esta data, a analise e possivel confirmacao so podem ser tratadas com pelo menos ${settings.minimumLeadDays} dias de antecedencia`);
  }

  return [
    "Orcamento Cakes Josy Silva",
    "",
    `Tipo: ${result.request.typeName}`,
    `Data pretendida: ${dateInfo.date || result.request.date || "Por confirmar"}${dateInfo.weekday ? ` (${dateInfo.weekday})` : ""}`,
    "Detalhes:",
    ...detailLines,
    `Valor estimado: ${formatCurrency(result.total)}`,
    "",
    "Importante:",
    ...importantLines,
  ].join("\n");
}

function estimateQuote(input, now = new Date()) {
  const request = normalizeInput(input);
  const missingFields = getMissingFields(request);
  const timing = evaluateTiming(request, now);

  if (missingFields.length) {
    return {
      ok: false,
      status: "missing_fields",
      request,
      timing,
      missingFields,
      message: buildMissingMessage(missingFields),
    };
  }

  const total = calculateTotal(request);
  const summaryRows = buildSummaryRows(request);

  return {
    ok: true,
    status: timing.confirmationAllowed ? "quoted" : "quoted_needs_review",
    request,
    timing,
    total,
    summaryRows,
    message: buildQuoteMessage({ request, timing, total, summaryRows }),
  };
}

function pickAll(text, list) {
  const normalized = normalizeText(text);
  return [...list]
    .sort((left, right) => normalizeText(right.name).length - normalizeText(left.name).length)
    .filter((item) => normalized.includes(normalizeText(item.name)))
    .filter((item, index, items) => {
      const currentName = normalizeText(item.name);
      return !items.slice(0, index).some((selected) => normalizeText(selected.name).includes(currentName));
    });
}

function extractFromText(text, context = {}) {
  const normalized = normalizeText(text);
  const containsWord = (pattern) => pattern.test(normalized);
  const type =
    (containsWord(/\bkit\b/) && "kit") ||
    (normalized.includes("acetato") && "acetato") ||
    ((normalized.includes("doce") || normalized.includes("salgado")) && !normalized.includes("bolo") && "avulsos") ||
    (normalized.includes("bolo") && "bolo") ||
    context.type;
  const peopleMatch = normalized.match(/(\d+)\s*(pessoas|pessoa)/);
  const weightMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*kg/);
  const dateMatch = normalized.match(/(20\d{2}-\d{2}-\d{2})/);
  const fillingOptions = pickAll(normalized, catalog.fillings);
  const categoryFromText = getFillingCategory(normalized);
  const firstFilling = fillingOptions[0];
  const secondFilling = fillingOptions[1];
  const fruit =
    (containsWord(/\bsem fruta\b/) && "sem-fruta") ||
    (containsWord(/\bsem frutas\b/) && "sem-fruta") ||
    (containsWord(/\bfrutos vermelhos\b/) && "frutos-vermelhos") ||
    (containsWord(/\bmorangos?\b/) && "morango") ||
    (normalized.includes("ananas") && "ananas") ||
    null;
  const decoration =
    (containsWord(/\bduas cores\b/) && containsWord(/\bnome\b/) && "duas-cores-nome") ||
    (containsWord(/\bduas cores\b/) && "duas-cores") ||
    ((containsWord(/\bdecoracao personalizada\b/) ||
      containsWord(/\bdecorado\b/) ||
      containsWord(/\btopo\b/) ||
      containsWord(/\bdrip\b/) ||
      containsWord(/\bflores\b/) ||
      containsWord(/\bpapel fotografico\b/)) &&
      "decorado") ||
    null;
  const format =
    (containsWord(/\bcoracao\b/) && "coracao") ||
    (containsWord(/\bredondo\b/) && "redondo") ||
    (containsWord(/\bretangular\b/) && "retangular") ||
    null;
  const kit =
    (containsWord(/\bkit\b/) &&
      (((containsWord(/\b6 pessoas\b/) || containsWord(/\bkit 6\b/)) && (normalized.includes("decor") ? "kit-6-decorado" : "kit-6")) ||
        ((containsWord(/\b10 pessoas\b/) || containsWord(/\bkit 10\b/)) && (normalized.includes("decor") ? "kit-10-decorado" : "kit-10")) ||
        (((containsWord(/\b20 pessoas\b/) || containsWord(/\b15 20\b/) || containsWord(/\bkit 20\b/)) &&
          (normalized.includes("decor") ? "kit-20-decorado" : "kit-20"))) ||
        (((containsWord(/\b30 pessoas\b/) || containsWord(/\b25 30\b/) || containsWord(/\bkit 30\b/)) &&
          (normalized.includes("decor") ? "kit-30-decorado" : "kit-30"))))) ||
    null;

  const raw = {
    ...context,
    type,
    people: peopleMatch ? Number(peopleMatch[1]) : context.people,
    weightKg: weightMatch ? weightMatch[1] : context.weightKg,
    date: dateMatch ? dateMatch[1] : context.date,
    mass: getMass(normalized)?.id || context.mass,
    fillingCategory: firstFilling?.category || categoryFromText?.id || context.fillingCategory,
    fillingFlavor: firstFilling?.id || context.fillingFlavor,
    secondFillingFlavor: secondFilling?.id || context.secondFillingFlavor,
    fruit: fruit || context.fruit,
    decoration: decoration || context.decoration,
    format: format || context.format,
    kit: kit || context.kit,
  };

  if (type === "avulsos" || normalized.includes("fatia") || normalized.includes("trufa") || normalized.includes("cone")) {
    raw.products = [
      ...(Array.isArray(context.products) ? context.products : []),
      ...pickAll(normalized, catalog.products).map((item) => ({ id: item.id, quantity: 1 })),
    ];
    raw.savories = [
      ...(Array.isArray(context.savories) ? context.savories : []),
      ...pickAll(normalized, catalog.savories).map((item) => ({ id: item.id })),
    ];
    raw.sweets = [
      ...(Array.isArray(context.sweets) ? context.sweets : []),
      ...pickAll(normalized, catalog.sweets).map((item) => ({ id: item.id })),
    ];
  }

  return estimateQuote(raw);
}

function buildCatalogLists() {
  return {
    fillings: [
      "Temos os seguintes recheios por categoria:",
      "",
      "Tradicional:",
      ...catalog.fillings.filter((item) => item.category === "tradicional").map((item) => `- ${item.name}`),
      "",
      "Especial:",
      ...catalog.fillings.filter((item) => item.category === "especial").map((item) => `- ${item.name}`),
      "",
      "Gourmet:",
      ...catalog.fillings.filter((item) => item.category === "gourmet").map((item) => `- ${item.name}`),
    ].join("\n"),
    kits: [
      "Temos estes kits festa:",
      "",
      ...catalog.kits.flatMap((item) => [`${item.name}:`, `- ${formatCurrency(item.price)}`, ""]),
    ].join("\n").trim(),
    sweets: [
      "Temos estas opcoes de doces:",
      "",
      "Doces tradicionais:",
      "- 20 un = 18 €",
      "- 50 un = 30 €",
      "- 100 un = 49 €",
      "",
      "Doces especiais:",
      "- 20 un = 25 €",
      "- 50 un = 45 €",
    ].join("\n"),
    savories: [
      "Temos estas opcoes de salgados:",
      "",
      "Mini salgados:",
      "- 25 un = 18 €",
      "- 50 un = 28 €",
      "- 100 un = 45 €",
      "",
      "Mini empadas de galinha:",
      "- 12 un = 14 €",
      "- 20 un = 23 €",
      "- 40 un = 40 €",
    ].join("\n"),
  };
}

module.exports = {
  catalog,
  settings,
  estimateQuote,
  extractFromText,
  buildCatalogLists,
  normalizeInput,
};
