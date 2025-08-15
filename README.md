This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# TEST

Desarrollo
1) Preparación del entorno de pruebas

Instalación de dependencias (Jest + RTL + TS):

jest@29, ts-jest@29, jest-environment-jsdom@29, @types/jest

@testing-library/react, @testing-library/jest-dom, @testing-library/user-event

identity-obj-proxy (mapea CSS en tests)

(Opcional) ts-node (solo si se usa jest.config.ts)

Configuración creada:

jest.config.cjs: usa ts-jest, testEnvironment: 'jsdom', moduleNameMapper para @/ y assets.

jest.setup.ts: import '@testing-library/jest-dom'.

tsconfig.jest.json: compila TSX para pruebas ("jsx": "react-jsx", "module": "commonjs").

__mocks__/fileMock.js: mock para imágenes/estáticos.

Estructura de pruebas: cada página con su carpeta __tests__:

src/app/login/__tests__/page.test.tsx

src/app/register/__tests__/page.test.tsx

src/app/mascotas/__tests__/page.test.tsx

src/app/vacunas/__tests__/page.test.tsx

Accesibilidad mínima para testear: se añadieron label htmlFor + id en inputs (especialmente email, password y date) y role="alert" para mostrar errores.

2) Qué se testeó por módulo/carpeta
# _A) Login (src/app/login)_

Archivo: __tests__/page.test.tsx
Mocks: next/navigation (router), useAuth (setToken), loginUser (API).
Casos cubiertos:

Render básico: existen campos “Correo electrónico”, “Contraseña” y botón “Iniciar sesión”.

Flujo exitoso: loginUser devuelve { token } → se llama setToken(token) y router.push('/home').

Error de credenciales: loginUser rechaza → aparece mensaje “Credenciales inválidas” con role="alert" (si se añadió) y no navega.

Navegación a registro: clic en “Regístrate aquí” → router.push('/register').


# _B) Register (src/app/register)_

Archivo: __tests__/page.test.tsx
Mocks: next/navigation (router), registerUser (API), window.alert.
Casos cubiertos:

Render básico: existen “Username”, “Correo electrónico”, “Contraseña” y botón “Registrarse”.

Registro exitoso: registerUser resuelve → se muestra alert('Usuario registrado exitosamente!') y router.push('/login').

Error de registro: registerUser rechaza → se muestra el mensaje de error en pantalla con role="alert" (p. ej., “Correo ya registrado”).

Navegación a login: clic en “Inicia sesión aquí” → router.push('/login').

Doble submit protegido: con loading, evita llamadas duplicadas.

# _C) Mascotas (src/app/mascotas)_

Archivo: __tests__/page.test.tsx
Mocks: useAuth (token), getPets, createPet, updatePet, deletePet.
Casos cubiertos:

Lista inicial: si getPets retorna elementos → se muestra tabla con columnas y filas; aparece botón “Registrar nueva mascota”.

Formulario por defecto sin mascotas: si getPets devuelve [] → se muestra formulario y al registrar (createPet) se refresca la lista.

Toggle formulario/lista: botón “Registrar nueva mascota” ↔ “Volver a la lista”.

Eliminar mascota: confirma (mock de window.confirm) → deletePet llamado y refresca lista; si cancela, no llama API.

Editar mascota: abre modal, modifica campos, updatePet y refresca (modal se cierra).

# _D) Vacunas (src/app/vacunas)_

Archivo: __tests__/page.test.tsx
Mocks: useAuth (token), getVacunas, createVacuna, updateVacuna, deleteVacuna, getPets.
Casos cubiertos:

Carga inicial y mapeo mascota: muestra tabla con vacuna y nombre de mascota mapeado por mascotaId (si no existe, muestra “Desconocido”).

Abrir formulario y registrar vacuna: llena mascotaId, nombre, fecha (via getByLabelText(/Fecha/i)), observaciones; createVacuna y refresco con getVacunas.

Editar vacuna: abre modal, cambia nombre y fecha (input con label “Fecha”), updateVacuna y refresco (modal cierra).

Eliminar vacuna (modal propio): Cancelar no llama API; Eliminar llama deleteVacuna y refresca lista.

3) Cómo se ejecutó

Comando de pruebas: npm test

(Opcional) Modo cobertura: npm run test:cov

(Opcional) Modo watch: npm run test:watch
