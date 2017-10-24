import {Pom} from "@atomist/rug/model/Pom";
import {Project} from "@atomist/rug/model/Project";
import {Editor, Parameter, Tags} from "@atomist/rug/operations/Decorators";
import {EditProject} from "@atomist/rug/operations/ProjectEditor";
import {Pattern} from "@atomist/rug/operations/RugOperation";
import {PathExpressionEngine} from "@atomist/rug/tree/PathExpression";

/**
 * AddConfig editor
 * - Adds maven dependencies
 */
@Editor("AddConfig", "adds REST get method")
@Tags("rug", "api", "config", "shboland")
export class AddConfig implements EditProject {
    @Parameter({
        displayName: "Module name",
        description: "Name of the module we want to add",
        pattern: Pattern.any,
        validInput: "Name",
        minLength: 0,
        maxLength: 100,
        required: false,
    })
    public apiModule: string = "api";

    public edit(project: Project) {
        this.addDependencies(project);
        this.addBootstrapYaml(project);
    }

    private addDependencies(project: Project): void {
        const eng: PathExpressionEngine = project.context.pathExpressionEngine;

        eng.with<Pom>(project, "/Pom()", pom => {
            pom.addOrReplaceDependency("org.springframework.cloud", "spring-cloud-starter-config");
        });
    }

    private addBootstrapYaml(project: Project): void {

        const resourceBootstrapYamlPath = this.apiModule + "/src/main/resources/bootstrap.yml";
        const rawBootstrapYaml = `spring.profiles.active: development
---
spring:
  profiles: development
  application:
    name: spring-boot-api
server:
  port: 8888
  contextPath: /api
`;

        if (!project.fileExists(resourceBootstrapYamlPath)) {
            project.addFile(resourceBootstrapYamlPath, rawBootstrapYaml);
        }
    }
}

export const addConfig = new AddConfig();
