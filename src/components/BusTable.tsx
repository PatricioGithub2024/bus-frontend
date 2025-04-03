import React, { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";

interface Bus {
  id: number;
  numeroBus: string;
  placa: string;
  fechaCreacion: string;
  caracteristicas: string;
  marca: string;
  activo: boolean;
}

const BusTable: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [filterId, setFilterId] = useState<string>("");

  //muestro todo el listado
  useEffect(() => {
    fetch("http://localhost:8080/m-bus/")
      .then((res) => res.json())
      .then((data) => {
        
        if (data.buses && Array.isArray(data.buses)) {
          setBuses(data.buses); 
          setFilteredBuses(data.buses);
        } else {
          console.error("No se encontró un array de buses:", data);
        }
        setLoading(false);
        
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, []);


  //para el filtro de ID
  const handleFilter = () => {
    if (filterId) {
      fetch(`http://localhost:8080/m-bus/${filterId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("No se encontró un bus con ese ID");
          }
          return res.json();
        })
        .then((data) => {
          if (data.bus) {
            alert(`Bus encontrado:\n
              ID: ${data.bus.id}\n
              Número de Bus: ${data.bus.numeroBus}\n
              Placa: ${data.bus.placa}\n
              Fecha Creación: ${data.bus.fechaCreacion}\n
              Características: ${data.bus.caracteristicas}\n
              Marca: ${data.bus.marca}\n
              Activo: ${data.bus.activo ? "SI" : "NO"}`);
          } else {
            throw new Error("No se encontró un bus con ese ID");
          }
        })
        .catch(() => alert("No se encontró un bus con ese ID"));
    }
  };


  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Número de Bus", dataIndex: "numeroBus", key: "numeroBus" },
    { title: "Placa", dataIndex: "placa", key: "placa" },
    { title: "Fecha Creación", dataIndex: "fechaCreacion", key: "fechaCreacion" },
    { title: "Características", dataIndex: "caracteristicas", key: "caracteristicas" },
    { title: "Marca", dataIndex: "marca", key: "marca", render: (marca: string) => marca || "Sin marca" },
    { title: "Activo", dataIndex: "activo", key: "activo", render: (activo: boolean) => (activo ? "SI" : "NO") },
  ];


  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <h1>Listado de Buses</h1>
      
      <div style={{ marginBottom: 16 }}>

        <Input
          placeholder="Filtrar por ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)} 
          style={{ width: 200, marginRight: 8 }}
        />
        <Button type="primary" onClick={handleFilter}>Filtrar</Button>

      </div>
      <Table
        columns={columns}
        dataSource={filteredBuses}
        loading={loading}
        pagination={{ pageSize: 10, current: page, onChange: setPage }}
        rowKey="id"
        style={{ width: "80%" }}
      />
      
    </div>
  );

};

export default BusTable;