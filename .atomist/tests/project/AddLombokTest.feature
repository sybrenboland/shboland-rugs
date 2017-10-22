
Feature: Add lombok should add lombok functionality

  Scenario: AddLombok should add lombok
    Given a maven project structure is there
    Given a Java class
    When the AddLombok is run
    Then the project pom has a lombok dependencymanagement dependency
    #Then the module pom has a lombok dependency
    Then the class has a Builder annotation


