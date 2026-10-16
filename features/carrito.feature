# language: en
@frontend @carrito
Feature: Productos seleccionados en carrito
  @FE-S04
  Scenario Outline: Mantener los productos seleccionados [<caso>]
    Given que ingresé como usuario estándar
    When agrego los productos "<productos>"
    Then el catálogo refleja los productos agregados
    When abro el carrito
    Then el carrito conserva los productos y sus importes
    Examples:
      | caso     | productos                                |
      | FE-EX-07 | Sauce Labs Backpack                      |
      | FE-EX-08 | Sauce Labs Backpack;Sauce Labs Bike Light |
