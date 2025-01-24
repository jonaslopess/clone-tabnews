import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI); // refreshInterval
  if (!isLoading && data) {
    let updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    let databaseVersion = data.dependencies.database.version;
    let databaseMaxConn = data.dependencies.database.max_connections;
    let databaseOpenedConn = data.dependencies.database.opened_connections;

    return (
      <>
        <div>Última atualização: {updatedAtText}</div>
        <div>Versão do bando de dados: {databaseVersion}</div>
        <div>
          Conexões abertas: {databaseOpenedConn}/{databaseMaxConn}
        </div>
        <div>
          <progress value={databaseOpenedConn} max={databaseMaxConn}></progress>
        </div>
      </>
    );
  } else {
    return (
      <>
        <p>🔄 Carregando...</p>
      </>
    );
  }
}

export default StatusPage;
