type Cliente = {
    nombre: string;
    direccion: string;
    contrato_id?: number;
  };
  const clientes: Cliente[] = [
    { nombre: "Juan Pérez", direccion: "Calle 123, Ciudad A", contrato_id: 1001 },
    { nombre: "María Gómez", direccion: "Avenida 456, Ciudad B", contrato_id: 1002 },
    { nombre: "Carlos López", direccion: "Carrera 789, Ciudad C" },
    { nombre: "Ana Ramírez", direccion: "Pasaje 321, Ciudad D", contrato_id: 1003 },
    { nombre: "Luis Torres", direccion: "Callejón 654, Ciudad E" },
    { nombre: "Celeste Herrera", direccion: "Boulevard 987, Ciudad F", contrato_id: 1004 },
    { nombre: "Fernando Díaz", direccion: "Autopista 111, Ciudad G" },
    { nombre: "Gabriela Castro", direccion: "Calle 222, Ciudad H", contrato_id: 1005 },
    { nombre: "Ricardo Mendoza", direccion: "Avenida 333, Ciudad I" },
    { nombre: "Patricia Flores", direccion: "Pasaje 444, Ciudad J", contrato_id: 1006 },
  ];
  
  export default clientes;
  