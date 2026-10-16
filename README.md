# Pruebas Frontend — Sauce Demo

Pruebas de login, carrito y checkout con Playwright, Cucumber y JavaScript. Los escenarios están escritos en Gherkin y las páginas siguen Page Object Model.

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
| `npm.cmd test -- --tags @FE-S04` | Ejecutar los ejemplos del carrito |

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
