const item = {
  // Потрібно передбачити мультимовність.

  purchaseName: "D206", // код виробника
  publicName: "D206", // код для продажу (може бути інший)

  title: "МАХОВИК УПРАВЛІННЯ З ДВОМА СПІЦЯМИ З ПОВОРОТНОЮ РУЧКОЮ",
  shortTitle: "МАХОВИК",

  brand: {
    id: 1,
    name: "Boteco",
  },

  description:
    "Full description Full description Full description Full description Full description",
  shortDescription: "Short description",

  images: {
    preview: "url", // Для картинок на сторінці підкатегорії
    gallery: [
      // Під нульовим індексом на фронті повинна бути головна картинка (за замовчуванням).
      // Або якщо це дуже зручно, можна зробити окреме поле під дефолтну картинку
      { url: "url", thumb: "url" },
      { url: "url", thumb: "url" },
      { url: "url", thumb: "url" },
    ],

    drawings: [
      // Під нульовим індексом на фронті повинне бути головне креслення (за замовчуванням).
      // Або якщо це дуже зручно, можна зробити окреме поле під дефолтне креслення
      { url: "url", thumb: "url" },
      { url: "url", thumb: "url" },
      { url: "url", thumb: "url" },
    ],
  },

  alternatives: [
    //Аьлтернативні вироби (схожі товари)
  ],

  itemProps: [
    {
      id: 1,
      title: "Матеріал",
      value: "Армований поліамід. Стійкі до масел і жирів.",
      order: 1,
    },
    {
      id: 1,
      title: "Колір",
      value: "чорний",
      order: 2,
    },
    {
      id: 1,
      title: "Версія TD",
      value:
        "Вставка з оцинкованої сталі з гладким наскрізним отвором (допуск H11).",
      order: 3,
    },
    {
      id: 1,
      title: "Ковпачок, колір",
      value: [
        // Value може бути як строкою, так і масивом. Чи можливо таке організувати?
        { id: 13477, title: "Червоний", value: "Red (RAL 3000 cod. 16)" },
        { id: 12435, title: "Синій", value: "Blue (RAL 5015 cod. 07)" },
        {
          id: 11213,
          title: "Помаранчевий",
          value: "Orange (RAL 2004 cod. 02)",
        },
      ],
      order: 4,
    },
  ],

  pdf: "item download url", // Пдф всієї моделі (item)

  params: [
    { title: "D", order: 1 },
    { title: "L", order: 2 },
    { title: "Weight", order: 3 },
  ],

  articles: [
    // фактичні товари - типорозміри, або підвиди моделі (item)
    {
      id: 1,
      name: "D16195.TP0501",
      params: [
        {
          title: "D",
          value: "80",
        },
        {
          title: "L",
          value: "115",
        },
        {
          title: "C",
          value: "650",
        },
      ],

      tab: "JSON", // Всі інші табличні розміри та параметри артикулу, які не є важливими для фільтру.

      _3d: "download url",

      pdf: "download url", // Пдф безпосередньо артикулу

      price: {
        purchase: "111",
        purchaseDiscount: "40", // %
      },

      weight: {
        value: "45",
        unit: "g",
      },
    },
  ],

  suitableFor: [], // id моделей (items) до яких підходить ця модель (наприклад, ручка підходить до маховика)
};
