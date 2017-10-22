

import {Project} from "@atomist/rug/model/Project";
import {Given, ProjectScenarioWorld, Then, When} from "@atomist/rug/test/project/Core";

const moduleNameInput = "module1";
const basePackageInput = "org.shboland";
const classNameInput = "Adres";

const mavenBasePath = "/src/main";
const beanPath = moduleNameInput + mavenBasePath + "/java/org/shboland/db/hibernate/bean/Adres.java";
const changelogPath = moduleNameInput + mavenBasePath + "/resources/liquibase/create-adres.xml";

Given("a maven project structure", (p: Project) => {
    p.addFile(moduleNameInput + mavenBasePath + "/java/pom.xml", "");
});

When("the AddBeanClass is run", (p: Project, w: ProjectScenarioWorld) => {
    const editor = w.editor("AddBeanClass");
    w.editWith(editor, {
        className: classNameInput,
        basePackage: basePackageInput,
        moduleName: moduleNameInput,
    });
});

Then("the project has new bean", (p: Project, w) => {
    return p.fileExists(beanPath);
});

Then("the bean has the given name", (p: Project, w) => {
    return p.fileContains(beanPath, classNameInput);
});

Then("a changelog has been added", (p: Project, w) => {
    return p.fileExists(changelogPath);
});
