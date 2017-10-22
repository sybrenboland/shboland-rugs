
Feature: Add bean class should add hibernate bean to project

  Scenario: AddBeanClass should add a bean
    Given a maven project structure
    When the AddBeanClass is run
    Then the project has new bean
    Then the bean has the given name
    Then a changelog has been added

