# language: en
@frontend @login
Feature: Acceso a Sauce Demo
  Background:
    Given que estoy en el login sin sesión

  @FE-S01 @FE-EX-01 @smoke
  Scenario: Acceder al catálogo con usuario estándar
    When ingreso "standard_user" y "secret_sauce"
    Then accedo al catálogo de productos

  @FE-S02
  Scenario Outline: Rechazar credenciales incorrectas [<caso>]
    When ingreso "<usuario>" y "<clave>"
    Then veo el error de acceso "<mensaje>"
    And permanezco fuera del catálogo
    Examples:
      | caso     | usuario                    | clave            | mensaje                                                                    |
      | FE-EX-02 | standard_user              | clave_incorrecta | Epic sadface: Username and password do not match any user in this service    |
      | FE-EX-03 | qa_inexistente_automatizado | secret_sauce     | Epic sadface: Username and password do not match any user in this service    |

  @FE-S07 @FE-EX-04
  Scenario: Impedir el acceso al usuario bloqueado
    When ingreso "locked_out_user" y "secret_sauce"
    Then veo el error de acceso "Epic sadface: Sorry, this user has been locked out."
    And permanezco fuera del catálogo

  @FE-S03
  Scenario Outline: Solicitar credenciales obligatorias [<caso>]
    When ingreso "<usuario>" y "<clave>"
    Then veo el error de acceso "<mensaje>"
    And permanezco fuera del catálogo
    Examples:
      | caso     | usuario       | clave        | mensaje                            |
      | FE-EX-05 |               | secret_sauce | Epic sadface: Username is required  |
      | FE-EX-06 | standard_user |              | Epic sadface: Password is required  |
