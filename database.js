const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const criarBanco = async () => {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
        CREATE TABLE IF NOT EXISTS incidentes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo_problema TEXT,
            localizacao TEXT,
            descricao TEXT,
            prioridade TEXT,
            nome_solicitante TEXT,
            data_registro TEXT,
            hora_registro TEXT,
            status_resolucao TEXT DEFAULT 'Pendente'
        )
        `);

  console.log("Banco de dados configurado.");

  // =============================
  //  Insert - C do CRUD - CREATE
  // =============================


  const checagem = await db.get(`SELECT COUNT (*) AS total FROM incidentes `);


if (checagem.total === 0) {
    await db.exec(`
       INSERT INTO incidentes(tipo_problema, localizacao,
        descricao, prioridade, nome_solicitante, data_registro,hora_registro) VALUES
        ("Iluminação", "Rua das Flores, 123, Bairro das Margaridas", "Poste queimado há dias", "Média", "Ana Clara", "16/03/2026", "10:30"),
        ("Falta de energia", "Hospital JP2", "Local na escuridão", "Alta", "Antonio Perna Quebrada", "16/03/2026", "22:15"),
        ("Vazamento de água", "Rua das Camélias, 52", "Vazamento de água constante próximo ao bueiro.", "Alta", "Julia Martins", "16/03/2026", "10:00"),
        ("Pavimentação", "Avenida C, Bairro D","Calçada em mau estado", "Alta", "Maria Oliveira","14/03/2026", "14:30"),
        ("Falta de água", "Rua T, 146, Jardim Imbarie", "Moradores sem água", "Alta", "Dona Fofoca", "16/03/2026", "10:00")
        
        `);
} else {
    console.log(`Banco pronto com${checagem.total} de incidentes `);
};

  // =============================
  //  Select - R do CRUD - READ
  // =============================

  const todosOsIncidentes = await db.all("SELECT * FROM incidentes");
  console.table(todosOsIncidentes);

  const chamadosAna = await db.all(`SELECT * FROM incidentes WHERE nome_solicitante = "Ana Clara"`);

  console.table(chamadosAna);


  // =============================
  //  UPDATE - U do CRUD - UPDATE
  // =============================

  await db.run(`
    UPDATE incidentes
    SET status_resolucao = "Em Análise"
    WHERE data_registro = "16/03/2026"
    `);

  console.log("Toda as reclamações do dia 16/03/2026 tiveram uma atualização");

  await db.run(`
    UPDATE incidentes
    SET status_resolucao = "Resolvido"
    WHERE tipo_problema = "Falta de energia"
    `)
    console.log("Problema do hospital resolvido");

  // =============================
  //  DELETE - D do CRUD - DELETE
  // =============================

await db.run(`DELETE FROM incidentes WHERE id = 2 `);

console.log("Registro do ID 2 removido")

    

    const resultadoFinal = await db.all(`SELECT * FROM incidentes`);
    console.table(resultadoFinal);

return db;
};

module.exports = {criarBanco};