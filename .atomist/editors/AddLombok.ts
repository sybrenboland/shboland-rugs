import {File} from "@atomist/rug/model/File";
import {Project} from "@atomist/rug/model/Project";
import {Editor, Parameter, Tags} from "@atomist/rug/operations/Decorators";
import {EditProject} from "@atomist/rug/operations/ProjectEditor";
import {Pattern} from "@atomist/rug/operations/RugOperation";
import {PathExpressionEngine} from "@atomist/rug/tree/PathExpression";
import {functions} from "./JavaClassFunctions";

/**
 * AddLicense editor
 * - Adds maven dependency (if not present)
 * -
 */
@Editor("AddLombok", "adds ")
@Tags("rug", "lombok", "maven", "shboland")
export class AddLombok implements EditProject {
    @Parameter({
        displayName: "Module name",
        description: "Name of the module we want to add",
        pattern: Pattern.any,
        validInput: "Name",
        minLength: 0,
        maxLength: 100,
        required: false,
    })
    public moduleName: string;

    @Parameter({
        displayName: "Qualified name bean",
        description: "package + bean.java",
        pattern: Pattern.any,
        validInput: "Fully qualified name of the bean",
        minLength: 1,
        maxLength: 100,
        required: false,
    })
    public beanPackage: string;

    public edit(project: Project) {
        updatePom(project);

    }
}

export function updatePom(project: Project): void {

    const eng: PathExpressionEngine = project.context.pathExpressionEngine;

    // eng.with<Pom>(project, "/Pom()", pom => {
    //     pom.addOrReplaceDependencyManagementDependency(
    //         "org.projectlombok",
    //         "lombok",
    //         "<dependency> " +
    //         "<groupId>org.projectlombok</groupId> " +
    //         "<artifactId>lombok</artifactId> " +
    //         "<version>1.16.18</version> " +
    //         "</dependency>",
    //     );
    // });

    // if (this.moduleName != null) {
    //     eng.with<Pom>(project, "module1/Pom()", pom => {
    //         pom.addOrReplaceDependency("org.projectlombok", "lombok");
    //     });
    // }


}

export const addLombok = new AddLombok();
