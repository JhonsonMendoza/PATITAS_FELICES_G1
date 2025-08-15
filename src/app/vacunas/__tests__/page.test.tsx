import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock Auth (si no hay token, el componente no llama APIs)
jest.mock("@/context/authContext", () => ({
  useAuth: () => ({ token: "test-token" }),
}));

// Mocks de APIs
const mockGetVacunas = jest.fn();
const mockCreateVacuna = jest.fn();
const mockUpdateVacuna = jest.fn();
const mockDeleteVacuna = jest.fn();
const mockGetPets = jest.fn();

jest.mock("@/apis/vacunas/route", () => ({
  getVacunas: (...args: any[]) => mockGetVacunas(...args),
  createVacuna: (...args: any[]) => mockCreateVacuna(...args),
  updateVacuna: (...args: any[]) => mockUpdateVacuna(...args),
  deleteVacuna: (...args: any[]) => mockDeleteVacuna(...args),
}));

jest.mock("@/apis/mascotas/route", () => ({
  getPets: (...args: any[]) => mockGetPets(...args),
}));

// Importar el componente DESPUÉS de declarar los mocks
import VacunasPage from "../page";

describe("VacunasPage", () => {
  const PETS = [
    { id: "1", nombre: "Firulais", tipo: "Perro", edad: 3, genero: "Macho" },
    { id: "2", nombre: "Mishi", tipo: "Gato", edad: 2, genero: "Hembra" },
  ];
  const VACUNAS = [
    {
      id: "v1",
      mascotaId: "1",
      nombre: "Rabia",
      fecha: "2025-01-10",
      observaciones: "1a dosis",
    },
    {
      id: "v2",
      mascotaId: "2",
      nombre: "Triple Felina",
      fecha: "2025-02-15",
      observaciones: "",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("muestra la tabla de vacunas con el nombre de la mascota mapeado", async () => {
    mockGetVacunas.mockResolvedValueOnce(VACUNAS);
    mockGetPets.mockResolvedValueOnce(PETS);

    render(<VacunasPage />);

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    // Headers clave
    expect(
      screen.getByRole("columnheader", { name: /Mascota/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Vacuna/i })
    ).toBeInTheDocument();

    // Filas: nombres de mascotas mapeados desde mascotaId
    expect(await screen.findByText("Firulais")).toBeInTheDocument();
    expect(await screen.findByText("Mishi")).toBeInTheDocument();
    expect(await screen.findByText("Rabia")).toBeInTheDocument();
    expect(await screen.findByText("Triple Felina")).toBeInTheDocument();
    // Botón de abrir formulario
    expect(
      screen.getByRole("button", { name: /Registrar Nueva Vacuna/i })
    ).toBeInTheDocument();
  });

  it("togglea el formulario, registra una vacuna y refresca la lista", async () => {
    // Carga inicial con datos existentes
    mockGetVacunas.mockResolvedValueOnce(VACUNAS);
    mockGetPets.mockResolvedValueOnce(PETS);
    render(<VacunasPage />);

    // Abrir formulario
    const toggleBtn = await screen.findByRole("button", {
      name: /Registrar Nueva Vacuna/i,
    });
    await userEvent.click(toggleBtn);

    // Form visible
    const registrarBtn = await screen.findByRole("button", {
      name: /^Registrar$/i,
    });
    expect(registrarBtn).toBeInTheDocument();

    // Llenar campos
    await userEvent.selectOptions(screen.getByRole("combobox"), "1"); // mascota Firulais
    await userEvent.type(
      screen.getByPlaceholderText(/Nombre de la vacuna/i),
      "Parvo"
    );

    // ⚠️ IMPORTANTE: el input de fecha debe tener label "Fecha" + id="fecha" en el componente
    const dateInput = screen.getByLabelText(/Fecha/i);
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, "2025-08-14");

    await userEvent.type(
      screen.getByPlaceholderText(/Observaciones/i),
      "Refuerzo"
    );

    mockCreateVacuna.mockResolvedValueOnce({});
    // Tras crear, el componente vuelve a llamar getVacunas:
    const UPDATED = [
      ...VACUNAS,
      {
        id: "v3",
        mascotaId: "1",
        nombre: "Parvo",
        fecha: "2025-08-14",
        observaciones: "Refuerzo",
      },
    ];
    mockGetVacunas.mockResolvedValueOnce(UPDATED);

    // Enviar
    await userEvent.click(registrarBtn);

    await waitFor(() => {
      expect(mockCreateVacuna).toHaveBeenCalledWith(
        {
          mascotaId: "1",
          nombre: "Parvo",
          fecha: "2025-08-14",
          observaciones: "Refuerzo",
        },
        "test-token"
      );
    });

    // Debe volver a la tabla con la nueva vacuna
    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(screen.getByText("Parvo")).toBeInTheDocument();
  });

  it("abre el modal de edición, actualiza la vacuna y refresca", async () => {
    mockGetVacunas.mockResolvedValueOnce(VACUNAS);
    mockGetPets.mockResolvedValueOnce(PETS);
    render(<VacunasPage />);

    const table = await screen.findByRole("table");
    // espera a que aparezca la celda con “Rabia”
    const rabiaCell = await screen.findByText("Rabia");
    const row = rabiaCell.closest("tr")!;
    await userEvent.click(within(row).getByRole("button", { name: /Editar/i }));

    // Modal visible
    expect(
      await screen.findByRole("heading", { name: /Editar Vacuna/i })
    ).toBeInTheDocument();

    // Cambiar nombre y fecha
    const nombreInput = screen.getByDisplayValue("Rabia");
    await userEvent.clear(nombreInput);
    await userEvent.type(nombreInput, "Rabia Refuerzo");

    // ⚠️ IMPORTANTE: en el modal, pon label+id (p. ej., htmlFor="fecha-edit", id="fecha-edit")
    const fechaEdit = screen.getByLabelText(/Fecha/i);
    await userEvent.clear(fechaEdit);
    await userEvent.type(fechaEdit, "2025-03-01");

    // Guardar
    mockUpdateVacuna.mockResolvedValueOnce({});
    const UPDATED = [
      {
        id: "v1",
        mascotaId: "1",
        nombre: "Rabia Refuerzo",
        fecha: "2025-03-01",
        observaciones: "1a dosis",
      },
      VACUNAS[1],
    ];
    mockGetVacunas.mockResolvedValueOnce(UPDATED);

    await userEvent.click(screen.getByRole("button", { name: /Guardar/i }));

    await waitFor(() => {
      expect(mockUpdateVacuna).toHaveBeenCalledWith(
        "v1",
        {
          id: "v1",
          mascotaId: "1",
          nombre: "Rabia Refuerzo",
          fecha: "2025-03-01",
          observaciones: "1a dosis",
        },
        "test-token"
      );
    });

    // Modal se cierra y la tabla refleja el cambio
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /Editar Vacuna/i })
      ).not.toBeInTheDocument();
    });
    expect(await screen.findByText("Rabia Refuerzo")).toBeInTheDocument();
  });

  it("abre modal de eliminación: cancelar no llama API, confirmar sí elimina y refresca", async () => {
    mockGetVacunas.mockResolvedValueOnce(VACUNAS);
    mockGetPets.mockResolvedValueOnce(PETS);
    render(<VacunasPage />);

    // Abrir modal de eliminación en fila de "Triple Felina" (v2)
    const table = await screen.findByRole("table");
    const tripleCell = await screen.findByText("Triple Felina"); // 👈 espera a que aparezca
    const row = tripleCell.closest("tr")!;
    await userEvent.click(
      within(row).getByRole("button", { name: /Eliminar/i })
    );

    // Modal visible
    expect(
      await screen.findByRole("heading", { name: /¿Eliminar esta vacuna\?/i })
    ).toBeInTheDocument();

    // Cancelar → no llama API, modal se cierra
    await userEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /¿Eliminar esta vacuna\?/i })
      ).not.toBeInTheDocument();
    });
    expect(mockDeleteVacuna).not.toHaveBeenCalled();

    // Abrir de nuevo y confirmar
    await userEvent.click(
      within(row).getByRole("button", { name: /Eliminar/i })
    );
    expect(
      await screen.findByRole("heading", { name: /¿Eliminar esta vacuna\?/i })
    ).toBeInTheDocument();

    mockDeleteVacuna.mockResolvedValueOnce({});
    const AFTER_DELETE = [VACUNAS[0]]; // quitamos v2
    mockGetVacunas.mockResolvedValueOnce(AFTER_DELETE);

    // Localiza el modal por su título
    const heading = await screen.findByRole("heading", {
      name: /¿Eliminar esta vacuna\?/i,
    });

    // Obtén la raíz del modal y CASTEA a HTMLElement
    const modalRoot =
      (heading.closest('[class*="fixed"]') as HTMLElement) ||
      (heading.parentElement as HTMLElement);

    // Click al botón "Eliminar" DENTRO del modal
    await userEvent.click(
      within(modalRoot).getByRole("button", { name: /^Eliminar$/i })
    );
    await waitFor(() => {
      expect(mockDeleteVacuna).toHaveBeenCalledWith("v2", "test-token");
    });

    // Modal cierra y tabla refresca sin "Triple Felina"
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /¿Eliminar esta vacuna\?/i })
      ).not.toBeInTheDocument();
    });
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.queryByText("Triple Felina")).not.toBeInTheDocument();
  });

  it('muestra "Desconocido" si no encuentra la mascota asociada', async () => {
    // No hay mascotas cargadas o no coincide el id
    mockGetVacunas.mockResolvedValueOnce([
      {
        id: "x",
        mascotaId: "99",
        nombre: "Moquillo",
        fecha: "2025-05-20",
        observaciones: "",
      },
    ]);
    mockGetPets.mockResolvedValueOnce([]); // lista vacía

    render(<VacunasPage />);

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(await screen.findByText("Moquillo")).toBeInTheDocument();
    expect(await screen.findByText("Desconocido")).toBeInTheDocument();
  });
});
