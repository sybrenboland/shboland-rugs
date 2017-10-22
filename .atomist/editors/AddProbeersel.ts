import {File} from "@atomist/rug/model/File";
import {Project} from "@atomist/rug/model/Project";
import {Editor, Parameter, Tags} from "@atomist/rug/operations/Decorators";
import {EditProject} from "@atomist/rug/operations/ProjectEditor";
import {Pattern} from "@atomist/rug/operations/RugOperation";
import {PathExpressionEngine} from "@atomist/rug/tree/PathExpression";
import {functions} from "./Functions";

/**
 * AddLicense editor
 * - Adds maven dependency (if not present)
 * -
 */
@Editor("AddProbeersel", "adds ")
@Tags("rug", "lombok", "maven", "shboland")
export class AddProbeersel implements EditProject {
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
    console.error("begin");

    const targetFile = "src/main/java/Adres.java";

    const certainFile: File = project.findFile(targetFile);
    if (certainFile === null) {
        console.error("File not found");
    }

    ////////////////////////////////////////
    // AddFunction
    const newFunction: string = `
    public Long findNumberOfBeans() {
        return getObjectCount();
    }
    `;
    functions.addFunction(certainFile, newFunction);

    ////////////////////////////////////////
    // AddAnnotationToClass
    const newAnnotation = "@Getter";
    functions.addAnnotationToClass(certainFile, newAnnotation);

    /////////////////////////////////////////
    // Add import
    const newImport = "lombok.getter";
    functions.addImport(certainFile, newImport);

    console.error("end");

}

export const addProbeersel = new AddProbeersel();