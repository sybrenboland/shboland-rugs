
Feature: Add converter should add a converter class to the api module

  Scenario: AddConverter should add a converter class
    Given a boot-api project structure
    When the AddConverter is run
    Then a converter class is added to the api module
