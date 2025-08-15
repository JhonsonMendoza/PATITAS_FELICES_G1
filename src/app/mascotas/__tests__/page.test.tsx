import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mocks de Auth y API
jest.mock('@/context/authContext', () => ({
  useAuth: () => ({ token: 'test-token' }),
}));

const mockGetPets = jest.fn();
const mockCreatePet = jest.fn();
const mockDeletePet = jest.fn();
const mockUpdatePet = jest.fn();

jest.mock('@/apis/mascotas/route', () => ({
  getPets: (...args: any[]) => mockGetPets(...args),
  createPet: (...args: any[]) => mockCreatePet(...args),
  deletePet: (...args: any[]) => mockDeletePet(...args),
  updatePet: (...args: any[]) => mockUpdatePet(...args),
}));

// Importa el componente DESPUÉS de definir los mocks
import MascotasPage from '../page';

describe('MascotasPage', () => {
  const PETS = [
    { id: '1', nombre: 'Firulais', tipo: 'Perro', edad: 3, genero: 'Macho' },
    { id: '2', nombre: 'Mishi', tipo: 'Gato', edad: 2, genero: 'Hembra' },
  ];

  let confirmSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it('muestra la tabla cuando hay mascotas', async () => {
    mockGetPets.mockResolvedValueOnce(PETS);

    render(<MascotasPage />);

    // Espera a que cargue la tabla
    expect(await screen.findByRole('table')).toBeInTheDocument();
    // Headers
    expect(screen.getByRole('columnheader', { name: /Nombre/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Acciones/i })).toBeInTheDocument();
    // Contenido
    expect(screen.getByText('Firulais')).toBeInTheDocument();
    expect(screen.getByText('Mishi')).toBeInTheDocument();

    // Existe el botón para alternar formulario
    expect(
      screen.getByRole('button', { name: /Registrar nueva mascota/i })
    ).toBeInTheDocument();
  });

  it('muestra el formulario por defecto cuando no hay mascotas y permite registrar', async () => {
    // Primera carga: vacío → debe mostrar formulario
    mockGetPets.mockResolvedValueOnce([]);
    // Tras crear, volverá a pedir mascotas → devolvemos una lista con una
    mockCreatePet.mockResolvedValueOnce({});
    mockGetPets.mockResolvedValueOnce([{ id: '10', nombre: 'Toby', tipo: 'Perro', edad: 1, genero: 'Macho' }]);

    render(<MascotasPage />);

    // Form visible
    expect(await screen.findByRole('button', { name: /Registrar Mascota/i })).toBeInTheDocument();

    // Llena y envía
    await userEvent.type(screen.getByPlaceholderText(/Nombre/i), 'Toby');
    await userEvent.type(screen.getByPlaceholderText(/Tipo/i), 'Perro');
    await userEvent.clear(screen.getByPlaceholderText(/Edad/i));
    await userEvent.type(screen.getByPlaceholderText(/Edad/i), '1');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'Macho');

    await userEvent.click(screen.getByRole('button', { name: /Registrar Mascota/i }));

    await waitFor(() => {
      expect(mockCreatePet).toHaveBeenCalledWith(
        { nombre: 'Toby', tipo: 'Perro', edad: 1, genero: 'Macho' },
        'test-token'
      );
    });

    // Debe refrescar la lista y ahora mostrar la tabla
    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Toby')).toBeInTheDocument();
  });

  it('alternar formulario con el botón cuando hay mascotas', async () => {
    mockGetPets.mockResolvedValueOnce(PETS);
    render(<MascotasPage />);

    const toggleBtn = await screen.findByRole('button', { name: /Registrar nueva mascota/i });
    await userEvent.click(toggleBtn);

    // Debe aparecer el botón "Registrar Mascota" dentro del form
    expect(await screen.findByRole('button', { name: /Registrar Mascota/i })).toBeInTheDocument();

    // Volver a la lista
    await userEvent.click(screen.getByRole('button', { name: /Volver a la lista/i }));
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });

  it('elimina una mascota tras confirmar y refresca la lista', async () => {
    mockGetPets.mockResolvedValueOnce(PETS);
    mockDeletePet.mockResolvedValueOnce({});
    // Tras eliminar, devolvemos lista sin el primer elemento
    mockGetPets.mockResolvedValueOnce([PETS[1]]);

    render(<MascotasPage />);

    const table = await screen.findByRole('table');
    const row = within(table).getByText('Firulais').closest('tr')!;
    const deleteBtn = within(row).getByRole('button', { name: /Eliminar/i });
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockDeletePet).toHaveBeenCalledWith('1', 'test-token');
    });

    // Después del refresh ya no debe estar Firulais
    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(screen.queryByText('Firulais')).not.toBeInTheDocument();
    expect(screen.getByText('Mishi')).toBeInTheDocument();
  });

  it('no elimina si el usuario cancela la confirmación', async () => {
    mockGetPets.mockResolvedValueOnce(PETS);
    confirmSpy.mockImplementationOnce(() => false); // cancelar

    render(<MascotasPage />);

    const table = await screen.findByRole('table');
    const row = within(table).getByText('Mishi').closest('tr')!;
    const deleteBtn = within(row).getByRole('button', { name: /Eliminar/i });
    await userEvent.click(deleteBtn);

    expect(mockDeletePet).not.toHaveBeenCalled();
  });

  it('edita una mascota (abre modal, actualiza y refresca)', async () => {
    mockGetPets.mockResolvedValueOnce(PETS);
    mockUpdatePet.mockResolvedValueOnce({});
    // Tras actualizar, simulamos que cambia el nombre
    const updatedList = [
      { ...PETS[0], nombre: 'Firulais Jr.' },
      PETS[1],
    ];
    mockGetPets.mockResolvedValueOnce(updatedList);

    render(<MascotasPage />);

    // Abre modal
    const table = await screen.findByRole('table');
    const row = within(table).getByText('Firulais').closest('tr')!;
    await userEvent.click(within(row).getByRole('button', { name: /Editar/i }));

    // Modal visible
    const modalTitle = await screen.findByRole('heading', { name: /Editar Mascota/i });
    expect(modalTitle).toBeInTheDocument();

    // Cambia nombre y guarda
    const nombreInput = screen.getByDisplayValue('Firulais');
    await userEvent.clear(nombreInput);
    await userEvent.type(nombreInput, 'Firulais Jr.');

    await userEvent.click(screen.getByRole('button', { name: /Guardar/i }));

    await waitFor(() => {
      expect(mockUpdatePet).toHaveBeenCalledWith(
        { id: '1', nombre: 'Firulais Jr.', tipo: 'Perro', edad: 3, genero: 'Macho' },
        'test-token'
      );
    });

    // Debe cerrar modal y refrescar tabla con el nombre actualizado
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Editar Mascota/i })).not.toBeInTheDocument();
    });
    expect(await screen.findByText('Firulais Jr.')).toBeInTheDocument();
  });
});
