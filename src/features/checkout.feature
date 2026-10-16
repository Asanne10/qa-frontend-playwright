# language: en
@regresion @checkout
Feature: Validación del comprador y confirmación
  @FE-S05
  Scenario Outline: Solicitar los datos del comprador [<caso>]
    Given que estoy en checkout con Backpack en el carrito
    When envío los datos "<nombre>", "<apellido>" y "<postal>"
    Then veo el error de checkout "<mensaje>"
    And el formulario conserva los datos válidos
    And el carrito conserva el producto preparado
    Examples:
      | caso     | nombre | apellido | postal | mensaje                        |
      | FE-EX-09 |        | Ccencho  | 11001  | Error: First Name is required  |
      | FE-EX-10 | Martin |          | 11001  | Error: Last Name is required   |
      | FE-EX-11 | Martin | Ccencho  |        | Error: Postal Code is required |

  @FE-S06 @smoke
  Scenario Outline: Completar una compra consistente [<caso>]
    Given que ingresé como usuario estándar
    When agrego los productos "<productos>"
    Then el catálogo refleja los productos agregados
    When abro el carrito
    Then el carrito conserva los productos y sus importes
    When inicio el checkout
    And envío los datos "<nombre>", "<apellido>" y "<postal>"
    Then el resumen conserva los productos y los importes son consistentes
    When confirmo la compra
    Then veo la confirmación del pedido
    Examples:
      | caso     | productos                                | nombre | apellido | postal |
      | FE-EX-12 | Sauce Labs Backpack                      | Martin | Ccencho  | 11001  |
      | FE-EX-13 | Sauce Labs Backpack;Sauce Labs Bike Light | Martin | Ccencho  | 11001  |

