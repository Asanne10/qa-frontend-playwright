# Convenciones del proyecto

- Mantener los features dentro de `src/features`.
- Mantener un archivo de steps por Page Object: login, inventory, cart y checkout.
- Registrar cada expresión de Cucumber una sola vez. Un escenario que atraviesa varias páginas reutiliza sus steps.
- Definir localizadores e interacciones en `src/pages` y `src/components`, no en los steps.
- Mantener las aserciones en los steps; extraer a `src/assertions` únicamente las compartidas.
- Usar `src/flows` para preparación compartida y `src/data` para datos de preparación.
- Conservar World y contexto independientes por ejemplo; cerrar recursos incluso ante errores.
- Mantener los IDs FE-S/FE-EX y las expectativas del requerimiento.
- Usar `@regresion` para los comportamientos existentes y `@smoke` para el subconjunto crítico. No usar `@frontend` ni `@fronted`.
- Trabajar con importes en centavos, sin pausas fijas ni reintentos para ocultar fallos.
- Verificar con `npm run check`, `npm run test:dry` y los escenarios afectados. El dry-run no prueba el sitio real.
- Conservar los reportes por fecha y su URL de ejecución; distinguir bloqueos del entorno de fallos de producto.
