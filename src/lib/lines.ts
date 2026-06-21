export type Line = {
  id: string;
  stations: string[]; // 7 stations: [origin, s2, s3, s4, s5, s6, destination]
};

export const LINES: Line[] = [
  { id: "L1", stations: ["Ribeirinha", "Praça Dr. Regala", "Mercado", "Praça Estrela", "Fonte Inês", "Chã de Alecrim", "Plateau"] },
  { id: "L2", stations: ["Praça Tchetchénia", "Mercado", "Praça Nova", "Hospital Baptista de Sousa", "Monte Sossego", "Praça Dr. Regala", "Portão do Cemitério"] },
  { id: "L3", stations: ["Regala", "Mercado", "Praça Nova", "Fonte Inês", "Chã de Alecrim", "Cruz João Évora", "Regala"] },
  { id: "L4", stations: ["Espia", "Cruz João Évora", "Fonte Inês", "Praça Nova", "Monte Sossego", "Bela Vista", "Monte Sossego"] },
  { id: "L5", stations: ["Lazareto Velho", "Lazareto", "Praça Nova", "Mercado", "Fonte Meio", "Ribeira Bote", "Chã de Marinha"] },
  { id: "L6", stations: ["Mindelo Hotel", "Praça Nova", "Mercado", "Praça Dr. Regala", "Fonte Inês", "Chã de Alecrim", "Mindelo Hotel"] },
  { id: "L7", stations: ["Horta Seca", "Fernando Pó", "Praça José Lopes", "Liceu Velho", "Fonte Meio", "Alto Brava", "Madeiralzinho"] },
  { id: "L8", stations: ["Mindelo Hotel", "Praça Nova", "Mercado", "Ribeira Bote", "Fonte Meio", "Cruz João Évora", "Chã de Marinha"] },
  { id: "L9", stations: ["Pedra Rolada", "Campinho", "Praça Dr. Regala", "Mercado", "Fonte Inês", "Bela Vista", "Chã de Alecrim"] },
  { id: "L10", stations: ["Portelinha", "Monte Sossego", "Praça Nova", "Mercado", "Praça Dr. Regala", "Fonte Inês", "Chã de Alecrim"] },
];

export const getLine = (id: string) => LINES.find((l) => l.id === id);
