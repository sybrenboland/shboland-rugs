import {Project} from "@atomist/rug/model/Project";
import {Given, ProjectScenarioWorld, Then, When} from "@atomist/rug/test/project/Core";

const mavenBasePath = "/src/main/java";
const moduleNameInput = "module1";
const packageInput = "bean";
const className = "Person";
const javaClassContent = `package ${packageInput};

import javax.persistence.*;

@Entity
@Table(name = "${className.toUpperCase()}")
public class ${className} {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
}`;

const pomContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    
     <dependencies>
     </dependencies>
</project>
`;

Given("a maven project structure is there", (p: Project) => {
    p.addFile("pom.xml", pomContent);
    p.addFile(moduleNameInput + "/pom.xml", pomContent);
});

Given("a Java class", (p: Project) => {
    p.addFile(mavenBasePath + "/bean/Person.java", javaClassContent);
});

When("the AddLombok is run", (p: Project, w: ProjectScenarioWorld) => {
    const editor = w.editor("AddLombok");
    w.editWith(editor, {moduleName: moduleNameInput, beanQualifiedName: (packageInput + className + ".java")});
});

Then("the project pom has a lombok dependencymanagement dependency", (p: Project, w) => {
    return p.fileContains("pom.xml", "org.projectlombok");
});

Then("the module pom has a lombok dependency", (p: Project, w) => {
    return p.fileContains(moduleNameInput + "/pom.xml", "org.projectlombok");
});

Then("the class has a Builder annotation", (p: Project, w) => {
    return p.fileContains(moduleNameInput + mavenBasePath + "/" + packageInput + "/" + className + ".java", "Builder");
});
