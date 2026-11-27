(function () {
  'use strict';

  var ALIMENTOS = [

    { id: 'pollo', nombre: 'Pechuga de pollo a la plancha', grupo: 'proteina', funcion: 'Proteína magra', porcion: '100 g', kcal: 165, prot: 31, grasa: 3.6, carb: 0, alergenos: [], flags: [], tags: ['rapido', 'bajo_grasa'], interacciones: [] },
    { id: 'pavo', nombre: 'Pavo en trozos', grupo: 'proteina', funcion: 'Proteína magra', porcion: '100 g', kcal: 135, prot: 29, grasa: 1.6, carb: 0, alergenos: [], flags: [], tags: ['rapido', 'bajo_grasa'], interacciones: [] },
    { id: 'pescado_blanco', nombre: 'Pescado blanco al horno', grupo: 'proteina', funcion: 'Proteína magra', porcion: '100 g', kcal: 90, prot: 20, grasa: 1, carb: 0, alergenos: ['pescado'], flags: [], tags: ['omega3'], interacciones: [] },
    { id: 'atun', nombre: 'Atún en agua escurrido', grupo: 'proteina', funcion: 'Proteína magra', porcion: '100 g', kcal: 130, prot: 28, grasa: 1, carb: 0, alergenos: ['pescado'], flags: ['alto_sodio', 'embarazo_no'], tags: ['rapido'], interacciones: [] },
    { id: 'salmon', nombre: 'Salmón al horno', grupo: 'proteina', funcion: 'Proteína magra', porcion: '100 g', kcal: 208, prot: 22, grasa: 13, carb: 0, alergenos: ['pescado'], flags: [], tags: ['omega3'], interacciones: [] },
    { id: 'camaron', nombre: 'Camarón cocido', grupo: 'proteina', funcion: 'Proteína magra', porcion: '100 g', kcal: 99, prot: 24, grasa: 0.3, carb: 0.2, alergenos: ['mariscos'], flags: [], tags: ['rapido'], interacciones: [] },
    { id: 'huevo', nombre: 'Huevo cocido', grupo: 'proteina', funcion: 'Proteína', porcion: '1 pieza', kcal: 78, prot: 6, grasa: 5.3, carb: 0.6, alergenos: ['huevo'], flags: [], tags: ['rapido', 'economico'], interacciones: [] },
    { id: 'tofu', nombre: 'Tofu salteado', grupo: 'proteina', funcion: 'Proteína vegetal', porcion: '100 g', kcal: 76, prot: 8, grasa: 4.8, carb: 1.9, alergenos: ['soya'], flags: [], tags: ['vegetal'], interacciones: ['levotiroxina'] },
    { id: 'tempeh', nombre: 'Tempeh a la plancha', grupo: 'proteina', funcion: 'Proteína vegetal', porcion: '100 g', kcal: 192, prot: 20, grasa: 11, carb: 7.6, alergenos: ['soya'], flags: [], tags: ['vegetal'], interacciones: ['levotiroxina'] },

    { id: 'frijoles', nombre: 'Frijoles cocidos', grupo: 'leguminosa', funcion: 'Proteína vegetal', porcion: '100 g', kcal: 130, prot: 9, grasa: 0.5, carb: 23, alergenos: [], flags: [], tags: ['vegetal', 'fibra', 'economico'], interacciones: ['levotiroxina'] },
    { id: 'lentejas', nombre: 'Lentejas cocidas', grupo: 'leguminosa', funcion: 'Proteína vegetal', porcion: '100 g', kcal: 116, prot: 9, grasa: 0.4, carb: 20, alergenos: [], flags: [], tags: ['vegetal', 'fibra', 'hierro', 'economico'], interacciones: ['levotiroxina'] },
    { id: 'garbanzos', nombre: 'Garbanzos cocidos', grupo: 'leguminosa', funcion: 'Proteína vegetal', porcion: '100 g', kcal: 164, prot: 9, grasa: 2.6, carb: 27, alergenos: [], flags: [], tags: ['vegetal', 'fibra', 'economico'], interacciones: ['levotiroxina'] },
    { id: 'frijol_negro', nombre: 'Frijol negro cocido', grupo: 'leguminosa', funcion: 'Proteína vegetal', porcion: '100 g', kcal: 130, prot: 9, grasa: 0.5, carb: 23, alergenos: [], flags: [], tags: ['vegetal', 'fibra', 'economico', 'regional'], interacciones: ['levotiroxina'] },

    { id: 'yogur_natural', nombre: 'Yogur natural', grupo: 'lacteo', funcion: 'Lácteo', porcion: '150 g', kcal: 90, prot: 6, grasa: 3, carb: 9, alergenos: ['lactosa'], flags: [], tags: ['calcio'], interacciones: ['levotiroxina', 'antibiotico'] },
    { id: 'yogur_griego', nombre: 'Yogur griego natural', grupo: 'lacteo', funcion: 'Lácteo', porcion: '150 g', kcal: 130, prot: 15, grasa: 4, carb: 6, alergenos: ['lactosa'], flags: [], tags: ['calcio', 'proteina'], interacciones: ['levotiroxina', 'antibiotico'] },
    { id: 'leche', nombre: 'Leche semidescremada', grupo: 'lacteo', funcion: 'Lácteo', porcion: '250 ml', kcal: 120, prot: 8, grasa: 4.5, carb: 12, alergenos: ['lactosa'], flags: [], tags: ['calcio'], interacciones: ['levotiroxina', 'antibiotico'] },
    { id: 'queso_fresco', nombre: 'Queso fresco', grupo: 'lacteo', funcion: 'Lácteo', porcion: '50 g', kcal: 150, prot: 10, grasa: 11, carb: 2, alergenos: ['lactosa'], flags: ['grasa_saturada', 'alto_sodio'], tags: ['calcio'], interacciones: ['levotiroxina', 'antibiotico', 'antidepresivo'] },
    { id: 'queso_panela', nombre: 'Queso panela', grupo: 'lacteo', funcion: 'Lácteo', porcion: '50 g', kcal: 120, prot: 10, grasa: 8, carb: 2, alergenos: ['lactosa'], flags: [], tags: ['calcio', 'regional'], interacciones: ['levotiroxina', 'antibiotico'] },

    { id: 'avena', nombre: 'Avena certificada sin gluten', grupo: 'cereal', funcion: 'Cereal integral', porcion: '40 g', kcal: 156, prot: 5, grasa: 3, carb: 27, alergenos: [], flags: [], tags: ['sin_gluten', 'fibra', 'integral', 'economico'], interacciones: ['levotiroxina'] },
    { id: 'arroz_integral', nombre: 'Arroz integral cocido', grupo: 'cereal', funcion: 'Cereal integral', porcion: '150 g', kcal: 168, prot: 4, grasa: 1.4, carb: 35, alergenos: [], flags: [], tags: ['integral', 'economico'], interacciones: [] },
    { id: 'arroz_blanco', nombre: 'Arroz blanco cocido', grupo: 'cereal', funcion: 'Cereal', porcion: '150 g', kcal: 195, prot: 4, grasa: 0.4, carb: 43, alergenos: [], flags: ['alto_ig'], tags: ['economico'], interacciones: [] },
    { id: 'quinoa', nombre: 'Quinoa cocida', grupo: 'cereal', funcion: 'Cereal integral', porcion: '150 g', kcal: 180, prot: 7, grasa: 2.9, carb: 30, alergenos: [], flags: [], tags: ['sin_gluten', 'integral', 'proteina'], interacciones: [] },
    { id: 'pan_integral', nombre: 'Pan integral', grupo: 'cereal', funcion: 'Cereal integral', porcion: '2 rebanadas', kcal: 160, prot: 8, grasa: 2, carb: 28, alergenos: ['gluten'], flags: [], tags: ['integral', 'fibra'], interacciones: [] },
    { id: 'tortilla_maiz', nombre: 'Tortillas de maíz', grupo: 'cereal', funcion: 'Cereal', porcion: '2 piezas', kcal: 120, prot: 4, grasa: 1.6, carb: 25, alergenos: [], flags: [], tags: ['sin_gluten', 'economico'], interacciones: [] },
    { id: 'tortilla_harina', nombre: 'Tortilla de harina', grupo: 'cereal', funcion: 'Cereal', porcion: '1 pieza', kcal: 140, prot: 4, grasa: 4, carb: 22, alergenos: ['gluten'], flags: ['alto_ig'], tags: [], interacciones: [] },
    { id: 'pasta_integral', nombre: 'Pasta integral cocida', grupo: 'cereal', funcion: 'Cereal integral', porcion: '150 g', kcal: 186, prot: 7, grasa: 1, carb: 37, alergenos: ['gluten'], flags: [], tags: ['integral'], interacciones: [] },
    { id: 'papa', nombre: 'Papa cocida', grupo: 'cereal', funcion: 'Tubérculo', porcion: '150 g', kcal: 130, prot: 3, grasa: 0.2, carb: 30, alergenos: [], flags: [], tags: ['economico'], interacciones: [] },
    { id: 'camote', nombre: 'Camote cocido', grupo: 'cereal', funcion: 'Tubérculo', porcion: '150 g', kcal: 129, prot: 2, grasa: 0.2, carb: 30, alergenos: [], flags: [], tags: ['bajo_ig', 'fibra', 'economico'], interacciones: [] },
    { id: 'granola', nombre: 'Granola sin azúcar añadida', grupo: 'cereal', funcion: 'Cereal integral', porcion: '30 g', kcal: 130, prot: 3, grasa: 5, carb: 19, alergenos: ['gluten', 'frutos_secos'], flags: [], tags: ['integral'], interacciones: [] },
    { id: 'galleta_integral', nombre: 'Galletas integrales sin azúcar', grupo: 'cereal', funcion: 'Cereal', porcion: '2 piezas', kcal: 120, prot: 3, grasa: 4, carb: 19, alergenos: ['gluten'], flags: ['alto_ig'], tags: [], interacciones: [] },
    { id: 'elote', nombre: 'Elote cocido', grupo: 'cereal', funcion: 'Cereal', porcion: '1 pieza', kcal: 130, prot: 4, grasa: 1.8, carb: 28, alergenos: [], flags: [], tags: ['economico', 'fibra', 'regional'], interacciones: [] },
    { id: 'platano_macho', nombre: 'Plátano macho cocido', grupo: 'cereal', funcion: 'Tubérculo', porcion: '100 g', kcal: 122, prot: 1.3, grasa: 0.4, carb: 32, alergenos: [], flags: [], tags: ['economico', 'regional'], interacciones: [] },

    { id: 'espinaca', nombre: 'Espinaca cocida', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 23, prot: 3, grasa: 0.4, carb: 3.6, alergenos: [], flags: [], tags: ['hierro', 'folato'], interacciones: ['anticoagulante'] },
    { id: 'brocoli', nombre: 'Brócoli al vapor', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 34, prot: 3, grasa: 0.4, carb: 7, alergenos: [], flags: [], tags: ['fibra', 'calcio'], interacciones: ['anticoagulante'] },
    { id: 'zanahoria', nombre: 'Zanahoria', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 41, prot: 1, grasa: 0.2, carb: 10, alergenos: [], flags: [], tags: ['fibra', 'economico'], interacciones: [] },
    { id: 'jitomate', nombre: 'Jitomate', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 18, prot: 1, grasa: 0.2, carb: 3.9, alergenos: [], flags: [], tags: ['economico'], interacciones: [] },
    { id: 'calabacin', nombre: 'Calabacín', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 17, prot: 1, grasa: 0.3, carb: 3.1, alergenos: [], flags: [], tags: ['economico'], interacciones: [] },
    { id: 'nopales', nombre: 'Nopales', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 16, prot: 1, grasa: 0.1, carb: 3.3, alergenos: [], flags: [], tags: ['fibra', 'economico'], interacciones: [] },
    { id: 'lechuga', nombre: 'Lechuga', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 15, prot: 1, grasa: 0.2, carb: 2.9, alergenos: [], flags: [], tags: ['economico'], interacciones: ['anticoagulante'] },
    { id: 'pimiento', nombre: 'Pimiento', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 31, prot: 1, grasa: 0.3, carb: 6, alergenos: [], flags: [], tags: [], interacciones: [] },
    { id: 'coliflor', nombre: 'Coliflor cocida', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 25, prot: 2, grasa: 0.3, carb: 5, alergenos: [], flags: [], tags: ['fibra'], interacciones: ['anticoagulante'] },
    { id: 'ejotes', nombre: 'Ejotes', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 31, prot: 2, grasa: 0.2, carb: 7, alergenos: [], flags: [], tags: ['fibra', 'economico'], interacciones: [] },
    { id: 'pepino', nombre: 'Pepino', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 15, prot: 1, grasa: 0.1, carb: 3.6, alergenos: [], flags: [], tags: ['economico'], interacciones: [] },
    { id: 'chayote', nombre: 'Chayote cocido', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 19, prot: 0.8, grasa: 0.1, carb: 4.5, alergenos: [], flags: [], tags: ['fibra', 'economico', 'regional'], interacciones: [] },
    { id: 'quelites', nombre: 'Quelites cocidos', grupo: 'verdura', funcion: 'Verdura', porcion: '100 g', kcal: 32, prot: 3.2, grasa: 0.5, carb: 5, alergenos: [], flags: [], tags: ['hierro', 'folato', 'regional'], interacciones: ['anticoagulante'] },
    { id: 'salsa_verde', nombre: 'Salsa verde', grupo: 'verdura', funcion: 'Verdura', porcion: '50 g', kcal: 15, prot: 0.8, grasa: 0.2, carb: 3, alergenos: [], flags: ['irritante'], tags: ['regional'], interacciones: [] },

    { id: 'platano', nombre: 'Plátano', grupo: 'fruta', funcion: 'Fruta', porcion: '1 pieza', kcal: 105, prot: 1, grasa: 0.4, carb: 27, alergenos: [], flags: [], tags: ['potasio', 'economico'], interacciones: ['diuretico'] },
    { id: 'manzana', nombre: 'Manzana', grupo: 'fruta', funcion: 'Fruta', porcion: '1 pieza', kcal: 95, prot: 0, grasa: 0.3, carb: 25, alergenos: [], flags: [], tags: ['fibra', 'economico'], interacciones: [] },
    { id: 'pera', nombre: 'Pera', grupo: 'fruta', funcion: 'Fruta', porcion: '1 pieza', kcal: 101, prot: 1, grasa: 0.2, carb: 27, alergenos: [], flags: [], tags: ['fibra'], interacciones: [] },
    { id: 'naranja', nombre: 'Naranja', grupo: 'fruta', funcion: 'Fruta', porcion: '1 pieza', kcal: 62, prot: 1, grasa: 0.2, carb: 15, alergenos: [], flags: ['irritante'], tags: ['vitamina_c', 'economico'], interacciones: [] },
    { id: 'fresas', nombre: 'Fresas', grupo: 'fruta', funcion: 'Fruta', porcion: '150 g', kcal: 48, prot: 1, grasa: 0.5, carb: 12, alergenos: [], flags: [], tags: ['vitamina_c'], interacciones: [] },
    { id: 'papaya', nombre: 'Papaya', grupo: 'fruta', funcion: 'Fruta', porcion: '150 g', kcal: 65, prot: 1, grasa: 0.4, carb: 16, alergenos: [], flags: [], tags: ['fibra'], interacciones: [] },
    { id: 'kiwi', nombre: 'Kiwi', grupo: 'fruta', funcion: 'Fruta', porcion: '1 pieza', kcal: 42, prot: 1, grasa: 0.4, carb: 10, alergenos: [], flags: ['irritante'], tags: ['vitamina_c'], interacciones: [] },

    { id: 'aguacate', nombre: 'Aguacate', grupo: 'grasa', funcion: 'Grasa saludable', porcion: '50 g', kcal: 80, prot: 1, grasa: 7.3, carb: 4, alergenos: [], flags: [], tags: ['grasa_saludable'], interacciones: [] },
    { id: 'aceite_oliva', nombre: 'Aceite de oliva', grupo: 'grasa', funcion: 'Grasa saludable', porcion: '1 cucharada', kcal: 90, prot: 0, grasa: 10, carb: 0, alergenos: [], flags: [], tags: ['grasa_saludable'], interacciones: [] },
    { id: 'almendras', nombre: 'Almendras', grupo: 'grasa', funcion: 'Grasa saludable', porcion: '20 g', kcal: 116, prot: 4, grasa: 10, carb: 4, alergenos: ['frutos_secos'], flags: [], tags: ['grasa_saludable'], interacciones: [] },
    { id: 'nueces', nombre: 'Nueces', grupo: 'grasa', funcion: 'Grasa saludable', porcion: '20 g', kcal: 131, prot: 3, grasa: 13, carb: 3, alergenos: ['frutos_secos'], flags: [], tags: ['grasa_saludable', 'omega3'], interacciones: [] },
    { id: 'semillas', nombre: 'Semillas de girasol', grupo: 'grasa', funcion: 'Grasa saludable', porcion: '20 g', kcal: 117, prot: 4, grasa: 10, carb: 4, alergenos: [], flags: [], tags: ['grasa_saludable', 'fibra'], interacciones: [] },
    { id: 'chia', nombre: 'Chía', grupo: 'grasa', funcion: 'Grasa saludable', porcion: '15 g', kcal: 73, prot: 2, grasa: 4.6, carb: 6, alergenos: [], flags: [], tags: ['grasa_saludable', 'fibra', 'calcio'], interacciones: [] },

    { id: 'cafe', nombre: 'Café sin azúcar', grupo: 'bebida', funcion: 'Bebida', porcion: '1 taza', kcal: 2, prot: 0, grasa: 0, carb: 0.3, alergenos: [], flags: ['irritante', 'embarazo_no'], tags: [], interacciones: ['levotiroxina', 'diuretico'] },
    { id: 'te', nombre: 'Té sin azúcar', grupo: 'bebida', funcion: 'Bebida', porcion: '1 taza', kcal: 0, prot: 0, grasa: 0, carb: 0, alergenos: [], flags: [], tags: ['sin_calorias'], interacciones: ['levotiroxina'] },
    { id: 'agua', nombre: 'Agua simple', grupo: 'bebida', funcion: 'Bebida', porcion: '250 ml', kcal: 0, prot: 0, grasa: 0, carb: 0, alergenos: [], flags: [], tags: ['sin_calorias'], interacciones: [] },

    { id: 'miel', nombre: 'Miel', grupo: 'extra', funcion: 'Endulzante', porcion: '1 cucharada', kcal: 60, prot: 0, grasa: 0, carb: 17, alergenos: [], flags: ['alto_azucar'], tags: [], interacciones: [] },
    { id: 'gelatina', nombre: 'Gelatina sin azúcar', grupo: 'extra', funcion: 'Postre', porcion: '1 porción', kcal: 10, prot: 1, grasa: 0, carb: 0, alergenos: [], flags: [], tags: ['sin_calorias'], interacciones: [] }
  ];

  var MENUS = [
    {
      id: 'eco-1',
      nombre: 'Campo y legumbres',
      presupuesto: 'economico',
      condiciones: ['diabetes', 'hipertension', 'gastritis', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['avena', 'platano', 'chia'],
        colacion1: ['manzana', 'zanahoria'],
        comida: ['frijoles', 'tortilla_maiz', 'pollo', 'nopales', 'jitomate', 'aguacate'],
        colacion2: ['pera', 'semillas'],
        cena: ['arroz_integral', 'pescado_blanco', 'calabacin', 'aceite_oliva', 'te']
      }
    },
    {
      id: 'eco-2',
      nombre: 'Huevo, atún y arroz',
      presupuesto: 'economico',
      condiciones: ['diabetes', 'gastritis', 'colesterol', 'tiroides', 'menopausia', 'somp'],
      comidas: {
        desayuno: ['huevo', 'tortilla_maiz', 'jitomate', 'platano'],
        colacion1: ['papaya', 'semillas'],
        comida: ['atun', 'arroz_integral', 'zanahoria', 'lechuga', 'aceite_oliva', 'aguacate'],
        colacion2: ['manzana', 'semillas'],
        cena: ['lentejas', 'tortilla_maiz', 'calabacin', 'camote', 'te']
      }
    },
    {
      id: 'eco-3',
      nombre: 'Lentejas y pollo',
      presupuesto: 'economico',
      condiciones: ['diabetes', 'hipertension', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['avena', 'platano', 'chia'],
        colacion1: ['naranja', 'zanahoria'],
        comida: ['lentejas', 'frijoles', 'tortilla_maiz', 'pollo', 'espinaca', 'jitomate', 'aguacate'],
        colacion2: ['pera', 'semillas'],
        cena: ['papa', 'huevo', 'ejotes', 'aceite_oliva', 'te']
      }
    },
    {
      id: 'med-1',
      nombre: 'Avena, pollo y pescado',
      presupuesto: 'medio',
      condiciones: ['diabetes', 'hipertension', 'gastritis', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['avena', 'leche', 'platano', 'chia'],
        colacion1: ['yogur_natural', 'fresas'],
        comida: ['pollo', 'arroz_integral', 'lechuga', 'jitomate', 'aguacate', 'tortilla_maiz'],
        colacion2: ['zanahoria', 'semillas'],
        cena: ['pescado_blanco', 'papa', 'brocoli', 'aceite_oliva', 'te']
      }
    },
    {
      id: 'med-2',
      nombre: 'Huevo, pasta y frijoles',
      presupuesto: 'medio',
      condiciones: ['diabetes', 'hipertension', 'gastritis', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['huevo', 'pan_integral', 'platano'],
        colacion1: ['pera', 'almendras'],
        comida: ['pollo', 'pasta_integral', 'jitomate', 'calabacin', 'aceite_oliva', 'aguacate'],
        colacion2: ['manzana', 'semillas'],
        cena: ['frijoles', 'camote', 'espinaca', 'te']
      }
    },
    {
      id: 'med-3',
      nombre: 'Yogur, quinoa y pescado',
      presupuesto: 'medio',
      condiciones: ['diabetes', 'hipertension', 'gastritis', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['yogur_griego', 'avena', 'fresas', 'platano'],
        colacion1: ['manzana', 'nueces'],
        comida: ['quinoa', 'pescado_blanco', 'calabacin', 'jitomate', 'aceite_oliva'],
        colacion2: ['zanahoria', 'semillas'],
        cena: ['tortilla_maiz', 'huevo', 'espinaca', 'aguacate', 'frijoles', 'te']
      }
    },
    {
      id: 'amp-1',
      nombre: 'Salmón y quinoa',
      presupuesto: 'amplio',
      condiciones: ['diabetes', 'hipertension', 'gastritis', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['avena', 'leche', 'platano', 'almendras'],
        colacion1: ['yogur_griego', 'fresas'],
        comida: ['salmon', 'quinoa', 'lechuga', 'jitomate', 'aguacate', 'aceite_oliva'],
        colacion2: ['pera', 'semillas'],
        cena: ['pollo', 'camote', 'brocoli', 'te']
      }
    },
    {
      id: 'amp-2',
      nombre: 'Tostada, pasta y pescado',
      presupuesto: 'amplio',
      condiciones: ['hipertension', 'colesterol', 'tiroides', 'menopausia', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['pan_integral', 'aguacate', 'huevo', 'naranja'],
        colacion1: ['yogur_natural', 'granola'],
        comida: ['pollo', 'pasta_integral', 'brocoli', 'jitomate', 'aceite_oliva', 'aguacate'],
        colacion2: ['manzana', 'almendras'],
        cena: ['pescado_blanco', 'arroz_integral', 'calabacin', 'te']
      }
    },
    {
      id: 'amp-3',
      nombre: 'Huevo, pollo y tofu',
      presupuesto: 'amplio',
      condiciones: ['diabetes', 'hipertension', 'gastritis', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['huevo', 'tortilla_maiz', 'aguacate', 'papaya', 'platano'],
        colacion1: ['manzana', 'semillas'],
        comida: ['pollo', 'quinoa', 'lechuga', 'jitomate', 'aceite_oliva', 'frijoles'],
        colacion2: ['zanahoria', 'chia'],
        cena: ['tofu', 'camote', 'brocoli', 'te']
      }
    },
    {
      id: 'gen-1',
      nombre: 'Camarón y quinoa',
      presupuesto: 'generoso',
      condiciones: ['hipertension', 'gastritis', 'colesterol', 'tiroides', 'menopausia'],
      comidas: {
        desayuno: ['pan_integral', 'aguacate', 'huevo', 'fresas'],
        colacion1: ['yogur_griego', 'granola', 'miel'],
        comida: ['camaron', 'quinoa', 'lechuga', 'jitomate', 'aceite_oliva'],
        colacion2: ['manzana', 'nueces'],
        cena: ['pollo', 'papa', 'brocoli', 'te']
      }
    },
    {
      id: 'gen-2',
      nombre: 'Salmón, avena y frutos rojos',
      presupuesto: 'generoso',
      condiciones: ['diabetes', 'hipertension', 'gastritis', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['avena', 'leche', 'fresas', 'chia'],
        colacion1: ['yogur_griego', 'semillas'],
        comida: ['salmon', 'quinoa', 'espinaca', 'jitomate', 'aguacate'],
        colacion2: ['pera', 'almendras'],
        cena: ['pollo', 'camote', 'brocoli', 'te']
      }
    },
    {
      id: 'gen-3',
      nombre: 'Pollo, arroz y aguacate',
      presupuesto: 'generoso',
      condiciones: ['diabetes', 'hipertension', 'gastritis', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['pan_integral', 'huevo', 'aguacate', 'platano'],
        colacion1: ['manzana', 'semillas'],
        comida: ['pollo', 'arroz_integral', 'lechuga', 'jitomate', 'aceite_oliva', 'frijoles'],
        colacion2: ['zanahoria', 'chia'],
        cena: ['pollo', 'camote', 'espinaca', 'te']
      }
    },

    {
      id: 'norte-eco',
      nombre: 'Norte: huevo, frijol negro y tortilla',
      presupuesto: 'economico',
      region: 'norte',
      condiciones: ['diabetes', 'hipertension', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['huevo', 'tortilla_maiz', 'frijol_negro', 'salsa_verde'],
        colacion1: ['manzana', 'nueces'],
        comida: ['pollo', 'tortilla_maiz', 'frijol_negro', 'nopales', 'jitomate'],
        colacion2: ['pera', 'semillas'],
        cena: ['tortilla_maiz', 'queso_panela', 'calabacin', 'te']
      }
    },
    {
      id: 'norte-med',
      nombre: 'Norte: avena, pollo y tortilla de harina',
      presupuesto: 'medio',
      region: 'norte',
      condiciones: ['hipertension', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['avena', 'leche', 'platano', 'nueces'],
        colacion1: ['yogur_griego', 'fresas'],
        comida: ['pollo', 'tortilla_harina', 'frijol_negro', 'nopales', 'aguacate'],
        colacion2: ['pera', 'almendras'],
        cena: ['pescado_blanco', 'elote', 'calabacin', 'te']
      }
    },
    {
      id: 'centro-eco',
      nombre: 'Centro: frijol, nopal y quelites',
      presupuesto: 'economico',
      region: 'centro',
      condiciones: ['diabetes', 'hipertension', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['avena', 'platano', 'chia'],
        colacion1: ['manzana', 'zanahoria'],
        comida: ['frijoles', 'tortilla_maiz', 'pollo', 'nopales', 'salsa_verde'],
        colacion2: ['pera', 'semillas'],
        cena: ['quelites', 'queso_panela', 'tortilla_maiz', 'te']
      }
    },
    {
      id: 'centro-med',
      nombre: 'Centro: huevo, arroz y chayote',
      presupuesto: 'medio',
      region: 'centro',
      condiciones: ['diabetes', 'hipertension', 'gastritis', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['huevo', 'tortilla_maiz', 'jitomate', 'platano'],
        colacion1: ['papaya', 'semillas'],
        comida: ['pollo', 'arroz_integral', 'quelites', 'jitomate', 'aguacate'],
        colacion2: ['manzana', 'almendras'],
        cena: ['frijoles', 'chayote', 'tortilla_maiz', 'te']
      }
    },
    {
      id: 'sur-eco',
      nombre: 'Sur: plátano macho, frijol y chayote',
      presupuesto: 'economico',
      region: 'sur',
      condiciones: ['diabetes', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['platano_macho', 'frijol_negro', 'tortilla_maiz'],
        colacion1: ['papaya', 'semillas'],
        comida: ['pollo', 'arroz_integral', 'chayote', 'jitomate', 'aguacate'],
        colacion2: ['naranja', 'zanahoria'],
        cena: ['huevo', 'tortilla_maiz', 'ejotes', 'te']
      }
    },
    {
      id: 'costa-med',
      nombre: 'Costa: pescado, camarón y elote',
      presupuesto: 'medio',
      region: 'costa',
      condiciones: ['diabetes', 'hipertension', 'gastritis', 'colesterol', 'tiroides', 'menopausia', 'somp', 'embarazo', 'lactancia'],
      comidas: {
        desayuno: ['avena', 'leche', 'papaya', 'chia'],
        colacion1: ['yogur_natural', 'fresas'],
        comida: ['pescado_blanco', 'arroz_integral', 'jitomate', 'calabacin', 'aguacate'],
        colacion2: ['platano', 'semillas'],
        cena: ['camaron', 'elote', 'lechuga', 'te']
      }
    }
  ];

  var GRUPOS = {
    proteina: 'Proteína',
    leguminosa: 'Leguminosa',
    lacteo: 'Lácteo',
    cereal: 'Cereal o tubérculo',
    verdura: 'Verdura',
    fruta: 'Fruta',
    grasa: 'Grasa saludable',
    bebida: 'Bebida',
    extra: 'Extra'
  };

  var PRESUPUESTOS = {
    economico: { nombre: 'Económico', texto: 'Menos de $500 MXN / semana', orden: 1 },
    medio: { nombre: 'Medio', texto: '$500 – $1,000 MXN / semana', orden: 2 },
    amplio: { nombre: 'Amplio', texto: '$1,000 – $2,000 MXN / semana', orden: 3 },
    generoso: { nombre: 'Generoso', texto: 'Más de $2,000 MXN / semana', orden: 4 }
  };

  var CONDICIONES = {
    diabetes: { nombre: 'Diabetes', },
    hipertension: { nombre: 'Hipertensión', },
    gastritis: { nombre: 'Gastritis / reflujo', },
    colesterol: { nombre: 'Colesterol alto', },
    tiroides: { nombre: 'Tiroides', },
    celiaquia: { nombre: 'Celíaquía', },
    intolerancia_lactosa: { nombre: 'Intolerancia a la lactosa', }
  };

  var ALERGIAS = {
    gluten: { nombre: 'Gluten' },
    lactosa: { nombre: 'Lactosa' },
    frutos_secos: { nombre: 'Frutos secos' },
    mariscos: { nombre: 'Mariscos' },
    huevo: { nombre: 'Huevo' },
    soya: { nombre: 'Soya' },
    pescado: { nombre: 'Pescado' },
    otros: {
      nombre: 'Otros',
      requiereTexto: true,
    }
  };

  var MEDICAMENTOS = {
    ninguno: { nombre: 'Ninguno', },
    anticoagulante: {
      nombre: 'Anticoagulante (warfarina)',
    },
    levotiroxina: {
      nombre: 'Levotiroxina (tiroides)',
    },
    antibiotico: {
      nombre: 'Antibiótico (tetraciclina o quinolona)',
    },
    antidiabetico: {
      nombre: 'Antidiabético (metformina o insulina)',
    },
    diuretico: {
      nombre: 'Diurético o antihipertensivo',
    },
    estatina: {
      nombre: 'Estatina',
    },
    antidepresivo: {
      nombre: 'Antidepresivo (ISRS o IMAO)',
    },
    otro: {
      nombre: 'Otro medicamento',
    }
  };

  var ETAPAS = {
    ninguna: { nombre: 'Ninguna', },
    embarazo: { nombre: 'Embarazo', },
    lactancia: { nombre: 'Lactancia', },
    menopausia: { nombre: 'Menopausia', },
    somp: { nombre: 'SOMP', }
  };

  var ALERGIAS_POR_DEFECTO = [];
  var CONDICIONES_POR_DEFECTO = [];
  var ETAPA_POR_DEFECTO = 'ninguna';

  
  var EQUIVALENTES = {
    verdura:              { nombre: 'Verdura', prot: 2, lip: 0, carb: 4, kcal: 24, porcion: '1 taza cruda o ½ taza cocida' },
    fruta:                { nombre: 'Fruta', prot: 0, lip: 0, carb: 15, kcal: 60, porcion: '1 pieza pequeña o 1 taza' },
    cereal:               { nombre: 'Cereal sin grasa', prot: 2, lip: 0, carb: 15, kcal: 68, porcion: '1 tortilla, ½ taza cocida o 30 g de pan' },
    cereal_grasa:         { nombre: 'Cereal con grasa', prot: 2, lip: 5, carb: 15, kcal: 113, porcion: '1 pieza con grasa' },
    leguminosa:           { nombre: 'Leguminosa', prot: 8, lip: 1, carb: 20, kcal: 117, porcion: '½ taza cocida' },
    carne_muy_baja:       { nombre: 'Carne muy bajo aporte de grasa', prot: 7, lip: 1, carb: 0, kcal: 37, porcion: '30 g' },
    carne_baja:           { nombre: 'Carne bajo aporte de grasa', prot: 7, lip: 3, carb: 0, kcal: 55, porcion: '30 g' },
    carne_moderada:       { nombre: 'Carne moderado aporte de grasa', prot: 7, lip: 5, carb: 0, kcal: 73, porcion: '30 g' },
    carne_alta:           { nombre: 'Carne alto aporte de grasa', prot: 7, lip: 8, carb: 0, kcal: 100, porcion: '30 g' },
    leche_descremada:     { nombre: 'Leche descremada', prot: 9, lip: 2, carb: 12, kcal: 102, porcion: '1 taza' },
    leche_semidescremada: { nombre: 'Leche semidescremada', prot: 9, lip: 4, carb: 12, kcal: 120, porcion: '1 taza' },
    leche_entera:         { nombre: 'Leche entera', prot: 9, lip: 8, carb: 12, kcal: 156, porcion: '1 taza' },
    grasa_sin_proteina:   { nombre: 'Grasa sin proteína', prot: 0, lip: 5, carb: 0, kcal: 45, porcion: '1 cdta de aceite' },
    grasa_con_proteina:   { nombre: 'Grasa con proteína', prot: 3, lip: 5, carb: 3, kcal: 69, porcion: '1 cda o ⅛ de aguacate' },
    azucar:               { nombre: 'Azúcar', prot: 0, lip: 0, carb: 10, kcal: 40, porcion: '2 cdta' },
    bebida_sin_calorias:  { nombre: 'Bebida sin calorías', prot: 0, lip: 0, carb: 0, kcal: 0, porcion: '1 taza', libre: true }
  };

  
  var DISTRIBUCION = {
    equilibrada: { nombre: 'Equilibrada', carb: 50, prot: 25, lip: 25 },
    proteica: { nombre: 'Alta en proteína', carb: 40, prot: 30, lip: 30 },
    baja_grasa: { nombre: 'Baja en grasa', carb: 55, prot: 20, lip: 25 },
    diabetes: { nombre: 'Diabetes · bajo índice glucémico', carb: 45, prot: 25, lip: 30 },
    hipertension: { nombre: 'Hipertensión · estilo DASH', carb: 55, prot: 20, lip: 25 },
    colesterol: { nombre: 'Colesterol · menos grasa saturada', carb: 50, prot: 20, lip: 30 },
    somp: { nombre: 'SOMP · baja en carbohidratos', carb: 40, prot: 30, lip: 30 }
  };

  
  var DISTRIBUCION_SUGERIDA = {
    diabetes: 'diabetes',
    hipertension: 'hipertension',
    colesterol: 'colesterol',
    somp: 'somp'
  };

  var REGIONES = {
    todas: { nombre: 'Sin preferencia', },
    norte: { nombre: 'Norte', },
    centro: { nombre: 'Centro', },
    sur: { nombre: 'Sur', },
    costa: { nombre: 'Costa', }
  };

  
  var COMUNES = [
    'tortilla_maiz', 'frijoles', 'frijol_negro', 'arroz_blanco', 'huevo', 'avena',
    'leche', 'jitomate', 'nopales', 'elote', 'chayote', 'platano', 'manzana',
    'naranja', 'pollo', 'atun', 'queso_panela', 'aguacate', 'aceite_oliva',
    'calabacin', 'zanahoria', 'lentejas', 'yogur_natural', 'pan_integral'
  ];

  var DISTRIBUCION_POR_DEFECTO = 'equilibrada';

  window.VA_DIETAS = {
    ALIMENTOS: ALIMENTOS,
    MENUS: MENUS,
    GRUPOS: GRUPOS,
    PRESUPUESTOS: PRESUPUESTOS,
    CONDICIONES: CONDICIONES,
    ALERGIAS: ALERGIAS,
    MEDICAMENTOS: MEDICAMENTOS,
    ETAPAS: ETAPAS,

    EQUIVALENTES: EQUIVALENTES,
    DISTRIBUCION: DISTRIBUCION,
    DISTRIBUCION_SUGERIDA: DISTRIBUCION_SUGERIDA,
    REGIONES: REGIONES,
    COMUNES: COMUNES,
    DISTRIBUCION_POR_DEFECTO: DISTRIBUCION_POR_DEFECTO,
    ALERGIAS_POR_DEFECTO: ALERGIAS_POR_DEFECTO,
    CONDICIONES_POR_DEFECTO: CONDICIONES_POR_DEFECTO,
    ETAPA_POR_DEFECTO: ETAPA_POR_DEFECTO
  };
})();
