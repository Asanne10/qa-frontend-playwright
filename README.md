# Pruebas Frontend — Sauce Demo

Pruebas de login, carrito y checkout con Playwright, Cucumber y JavaScript. Los escenarios están escritos en Gherkin y las páginas siguen Page Object Model.

## Estructura del proyecto

Todo el código de pruebas está dentro de `src`. Los archivos de configuración, los scripts de ejecución y los reportes tienen responsabilidades distintas y permanecen en la raíz.

| Carpeta | Responsabilidad |
| --- | --- |
| `src/features/` | Escenarios Gherkin de login, carrito y checkout |
| `src/pages/` | Localizadores y acciones: `LoginPage`, `InventoryPage`, `CartPage` y `CheckoutPage` |
| `src/steps/` | Un archivo por página: `login.steps.js`, `inventory.steps.js`, `cart.steps.js` y `checkout.steps.js` |
| `src/components/` | Componente `ProductList`, compartido por las páginas con productos |
| `src/flows/` | Flujos de preparación compartidos, como iniciar sesión con el usuario estándar |
| `src/assertions/` | Aserciones reutilizadas por más de un flujo, como comprobar el carrito |
| `src/data/` | Credenciales públicas de preparación y generación de usuario inexistente |
| `src/support/` | World y hooks de apertura y cierre de cada sesión |
| `src/utils/` | Funciones de datos sin interacción con la interfaz, como convertir importes a centavos |
| `scripts/` | Ejecución, revisión de sintaxis e historial de reportes |

Cada step se define una sola vez, en el archivo de la página a la que corresponde. Los features pueden reutilizarlo al recorrer varias pantallas. Por ejemplo, la compra utiliza steps de catálogo, carrito y checkout sin duplicar las definiciones.

Los selectores y las interacciones se mantienen en Page Objects y componentes. Los steps coordinan las acciones y validan resultados. Los flujos y aserciones compartidos se importan explícitamente; no registran nuevos steps.

## Requisitos

- Node.js 24 y npm.
- Git para clonar el repositorio.
- Conexión a Internet para instalar dependencias, descargar Chromium y acceder a https://www.saucedemo.com/.

## Configuración

Clonar usando la URL del repositorio y entrar en la carpeta:

```sh
git clone https://github.com/Asanne10/qa-frontend-playwright.git
cd qa-frontend-playwright
```

En Windows, ejecutar desde PowerShell o CMD:

```powershell
npm.cmd ci
npx.cmd playwright install chromium
```

En macOS y Linux, usar `npm` y `npx` sin `.cmd`. Si Linux necesita dependencias del sistema:

```sh
npx playwright install --with-deps chromium
```

## Ejecución

```powershell
npm.cmd run check
npm.cmd run test:dry
npm.cmd test
```

`check` revisa la sintaxis. `test:dry` comprueba que los 13 ejemplos tengan sus pasos definidos, sin abrir la web; muestra los escenarios como omitidos. `test` ejecuta la suite completa contra Sauce Demo con Chromium sin ventana. Una ejecución aprobada muestra `13 scenarios (13 passed)` y `94 steps (94 passed)`.

| Comando | Uso |
| --- | --- |
| `npm.cmd run test:headed` | Ejecutar mostrando el navegador |
| `npm.cmd run test:smoke` | Ejecutar login válido y compras: 3 ejemplos |
| `npm.cmd run test:regresion` | Ejecutar la regresión completa: 13 ejemplos |
| `npm.cmd test -- --tags @FE-S04` | Ejecutar los ejemplos del carrito |

Los tres features llevan `@regresion`, porque sus 13 ejemplos comprueban comportamientos existentes de la suite. `@smoke` conserva el subconjunto de 3 ejemplos críticos y `@login`, `@carrito` y `@checkout` permiten seleccionar funcionalidades. Los IDs `FE-S` y `FE-EX` mantienen la trazabilidad. Se retiró la etiqueta `@frontend`.

Ejemplo con navegador visible y filtro de regresión:

```powershell
npm.cmd run test:headed -- --tags "@regresion"
```

## Reportes

Después de ejecutar las pruebas, abrir `reports/index.html`. Cada ejecución crea una carpeta con su reporte HTML, JSON, XML y un `execution.json` que registra la URL, las fechas y el resultado. Los reportes se generan localmente y están excluidos de Git.

Si algún escenario falla, el comando devuelve un código de salida distinto de cero. El detalle del error está en el reporte HTML.

## Variables de entorno

La URL predeterminada es `https://www.saucedemo.com/`.

| Variable | Valor predeterminado | Uso |
| --- | --- | --- |
| `BASE_URL` | `https://www.saucedemo.com/` | URL de la instancia que se va a probar |
| `HEADLESS` | `true` | Usar `false` para mostrar Chromium; también se configura con `test:headed` |
| `PW_PROXY_SERVER` | Sin proxy explícito | URL del proxy que necesita Chromium en una red corporativa |

Ejemplo para cambiar la URL durante una ejecución:

```powershell
$env:BASE_URL = "http://localhost:3000/"
npm.cmd test
Remove-Item Env:BASE_URL
```

Si la red requiere un proxy:

```powershell
$env:PW_PROXY_SERVER = "http://servidor-proxy:8080"
npm.cmd test
Remove-Item Env:PW_PROXY_SERVER
```

No se carga un archivo `.env` automáticamente. Las pruebas usan los usuarios públicos de Sauce Demo: `standard_user` y `locked_out_user`, ambos con la contraseña `secret_sauce`.

## GitHub Actions

En el repositorio, abrir **Actions > Pruebas Frontend > Run workflow**. Al finalizar, descargar el artefacto **reporte-frontend**, extraerlo y abrir `index.html`. El workflow instala las dependencias y Chromium, comprueba sintaxis y Gherkin y ejecuta las pruebas.

## Problemas frecuentes

- Si `npm` no se reconoce, instalar Node.js y abrir una terminal nueva.
- Si PowerShell bloquea `npm.ps1`, usar `npm.cmd` y `npx.cmd` como en los ejemplos.
- Si falta el navegador, ejecutar `npx.cmd playwright install chromium` en esa máquina.
- Si falla la navegación por certificado, proxy o timeout, comprobar el acceso a Sauce Demo y la configuración de red. No se desactiva la validación de certificados.
- El modo con ventana necesita una sesión de escritorio con permisos para abrir Chromium.

