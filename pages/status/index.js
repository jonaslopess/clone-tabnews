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
      <DatabaseInfo />
    </>
  );
}

function DatabaseInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI); // refreshInterval
  if (!isLoading && data) {
    let databaseVersion = data.dependencies.database.version;
    let databaseMaxConn = data.dependencies.database.max_connections;
    let databaseOpenedConn = data.dependencies.database.opened_connections;
    return (
      <>
        <h2>Banco de dados</h2>
        <div>Versão: {databaseVersion}</div>
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

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI); // refreshInterval
  if (!isLoading && data) {
    let updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    return (
      <>
        <div>Última atualização: {updatedAtText}</div>
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
